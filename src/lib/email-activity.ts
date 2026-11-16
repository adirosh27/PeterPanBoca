// Per-member activity for event emails: sent / failed, opens and link clicks.
// SERVER-SIDE ONLY.
//
// Each email gets a random token. The email's 1x1 image and its links point at
// /api/events/track/*?t=<token>; the token maps back to (event, kind, member).
// Opens are approximate: some apps block images (no open recorded until a
// click), and Apple Mail may load images automatically (open recorded early).
import { randomBytes } from 'crypto';
import { Redis } from '@upstash/redis';
import { memberEmails } from '@/lib/member-emails';

export type ActivityKind = 'invite' | 'reminder' | 'test';

export interface MemberActivity {
  sentAt?: string;
  error?: string;
  opens: number;
  firstOpen?: string;
  lastOpen?: string;
  clicks: number;
  lastClick?: string;
  links: string[];
}

const TOKEN_PREFIX = 'peter-pan-email-token:';
const ACTIVITY_PREFIX = 'peter-pan-email-activity:';
const TOKEN_TTL_SECONDS = 365 * 24 * 60 * 60;
export const SITE_URL = 'https://peter-pan-boca.vercel.app';

const redis = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return new Redis({ url, token });
  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
})();

const activityKey = (eventId: number, kind: ActivityKind) => `${ACTIVITY_PREFIX}${eventId}:${kind}`;
const empty = (): MemberActivity => ({ opens: 0, clicks: 0, links: [] });

interface TokenData {
  e: number;
  k: ActivityKind;
  m: string;
}

async function read(eventId: number, kind: ActivityKind, email: string): Promise<MemberActivity> {
  const raw = await redis!.hget<MemberActivity | string>(activityKey(eventId, kind), email);
  if (!raw) return empty();
  return typeof raw === 'string' ? (JSON.parse(raw) as MemberActivity) : raw;
}

async function write(eventId: number, kind: ActivityKind, email: string, data: MemberActivity) {
  await redis!.hset(activityKey(eventId, kind), { [email]: JSON.stringify(data) });
}

/** New tracking token for one member's copy of one email (null without Redis). */
export async function createToken(eventId: number, kind: ActivityKind, email: string): Promise<string | null> {
  if (!redis) return null;
  const token = randomBytes(12).toString('base64url');
  await redis.set(`${TOKEN_PREFIX}${token}`, JSON.stringify({ e: eventId, k: kind, m: email }), { ex: TOKEN_TTL_SECONDS });
  return token;
}

async function lookup(token: string): Promise<TokenData | null> {
  if (!redis || !/^[A-Za-z0-9_-]{8,40}$/.test(token)) return null;
  const raw = await redis.get<TokenData | string>(`${TOKEN_PREFIX}${token}`);
  if (!raw) return null;
  return typeof raw === 'string' ? (JSON.parse(raw) as TokenData) : raw;
}

export async function recordSent(eventId: number, kind: ActivityKind, email: string, error?: string) {
  if (!redis) return;
  const data = await read(eventId, kind, email);
  data.sentAt = new Date().toISOString();
  if (error) data.error = error;
  else delete data.error;
  await write(eventId, kind, email, data);
}

export async function recordOpen(token: string) {
  const t = await lookup(token);
  if (!t) return;
  const now = new Date().toISOString();
  const data = await read(t.e, t.k, t.m);
  data.opens += 1;
  data.firstOpen ??= now;
  data.lastOpen = now;
  await write(t.e, t.k, t.m, data);
}

// Only these destinations may be reached through the click redirect.
export function isAllowedLink(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    if (u.hostname === 'calendar.google.com') return true;
    if (u.hostname === 'www.google.com' && u.pathname.startsWith('/maps')) return true;
    return u.origin === SITE_URL;
  } catch {
    return false;
  }
}

const linkLabel = (url: string) => {
  const u = new URL(url);
  if (u.hostname === 'calendar.google.com') return 'Google Calendar';
  if (u.hostname === 'www.google.com') return 'Map';
  return 'Site calendar';
};

export async function recordClick(token: string, url: string) {
  const t = await lookup(token);
  if (!t) return;
  const now = new Date().toISOString();
  const data = await read(t.e, t.k, t.m);
  data.clicks += 1;
  data.lastClick = now;
  // A click means the email was opened, even if images were blocked.
  if (!data.opens) {
    data.opens = 1;
    data.firstOpen = now;
    data.lastOpen = now;
  }
  const label = linkLabel(url);
  if (!data.links.includes(label)) data.links.push(label);
  await write(t.e, t.k, t.m, data);
}

/** Activity for one event's email, one row per member (plus any other recipients). */
export async function getActivity(eventId: number, kind: ActivityKind) {
  if (!redis) throw new Error('Redis is not configured');
  const all = (await redis.hgetall<Record<string, MemberActivity | string>>(activityKey(eventId, kind))) ?? {};
  const parse = (v: MemberActivity | string) => (typeof v === 'string' ? (JSON.parse(v) as MemberActivity) : v);

  const rows = memberEmails.map((m) => ({
    name: m.name,
    email: m.email,
    ...(all[m.email] ? parse(all[m.email]) : empty()),
  }));
  for (const [email, v] of Object.entries(all)) {
    if (!memberEmails.some((m) => m.email === email)) rows.push({ name: email, email, ...parse(v) });
  }
  const sent = rows.filter((r) => r.sentAt && !r.error);
  return {
    eventId,
    kind,
    summary: {
      sent: sent.length,
      failed: rows.filter((r) => r.error).length,
      opened: sent.filter((r) => r.opens > 0).length,
      clicked: sent.filter((r) => r.clicks > 0).length,
    },
    rows: kind === 'test' ? rows.filter((r) => r.sentAt) : rows,
  };
}
