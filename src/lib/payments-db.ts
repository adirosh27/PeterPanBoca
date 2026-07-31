// Group payments store (Upstash Redis) + Gmail/IMAP sync.
//
// Payments are Zelle notifications forwarded to a Gmail account
// (peterpanboca@gmail.com). A sync reads the configured label over IMAP,
// parses each Chase "You received money with Zelle" email, best-effort
// matches the payer to a group member, guesses a category (event fee vs.
// quarterly dues), and upserts the result into Redis keyed by the Zelle
// transaction number (so re-syncing is idempotent).
import { Redis } from '@upstash/redis';

export type PaymentCategory = 'event' | 'quarterly' | 'other';

export interface Payment {
  id: string; // Zelle transaction number - unique, used for dedup
  payerNameRaw: string; // name exactly as it appears in the email
  memberName: string | null; // matched Hebrew member name, or null if unmatched
  amount: number; // in dollars
  currency: string; // always 'USD' for Zelle
  date: string; // ISO date (YYYY-MM-DD) the payment was sent
  memo: string; // free-text memo from the sender
  category: PaymentCategory;
  needsReview: boolean; // true when the member or category could not be determined confidently
  syncedAt: string; // ISO timestamp of the last sync that touched this record
  // Manual overrides set by an admin in the review UI. Once set, syncing
  // will not clobber the admin's memberName/category choices.
  reviewedBy?: string;
}

const PAYMENTS_KEY = 'peter-pan-payments';

// Admin password reused from the World Cup admin (single site admin password).
// Override with PAYMENTS_ADMIN_PASSWORD, else WORLDCUP_ADMIN_PASSWORD.
const ADMIN_PASSWORD =
  process.env.PAYMENTS_ADMIN_PASSWORD || process.env.WORLDCUP_ADMIN_PASSWORD || 'PeterPan2026';

export function isPaymentsAdmin(password?: string | null): boolean {
  return !!password && password === ADMIN_PASSWORD;
}

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

// -------------------- Redis CRUD --------------------

export async function getPayments(): Promise<Payment[]> {
  try {
    if (!redis) return [];
    const payments = await redis.get<Payment[]>(PAYMENTS_KEY);
    return payments || [];
  } catch (error) {
    console.error('Error getting payments from Redis:', error);
    return [];
  }
}

async function savePayments(payments: Payment[]): Promise<void> {
  if (!redis) throw new Error('Redis not available');
  await redis.set(PAYMENTS_KEY, payments);
}

// Merge freshly-parsed payments into the store, keyed by transaction id.
// Admin-reviewed fields (memberName/category when reviewedBy is set) are
// preserved so a re-sync never overwrites a manual correction.
export async function upsertPayments(parsed: Payment[]): Promise<number> {
  const existing = await getPayments();
  const byId = new Map(existing.map((p) => [p.id, p]));
  let added = 0;

  for (const incoming of parsed) {
    const prev = byId.get(incoming.id);
    if (!prev) {
      byId.set(incoming.id, incoming);
      added++;
      continue;
    }
    if (prev.reviewedBy) {
      // Keep the admin's memberName/category; refresh only the raw email fields.
      byId.set(incoming.id, {
        ...incoming,
        memberName: prev.memberName,
        category: prev.category,
        needsReview: prev.needsReview,
        reviewedBy: prev.reviewedBy,
      });
    } else {
      byId.set(incoming.id, incoming);
    }
  }

  await savePayments(Array.from(byId.values()));
  return added;
}

// Admin manual-review update: assign a member and/or category to a payment.
export async function updatePayment(
  id: string,
  fields: { memberName?: string | null; category?: PaymentCategory },
  reviewedBy: string
): Promise<boolean> {
  const payments = await getPayments();
  const idx = payments.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  payments[idx] = {
    ...payments[idx],
    ...(fields.memberName !== undefined ? { memberName: fields.memberName } : {}),
    ...(fields.category !== undefined ? { category: fields.category } : {}),
    needsReview: false,
    reviewedBy,
  };
  await savePayments(payments);
  return true;
}

export async function deletePayment(id: string): Promise<boolean> {
  const payments = await getPayments();
  const next = payments.filter((p) => p.id !== id);
  if (next.length === payments.length) return false;
  await savePayments(next);
  return true;
}

// Gmail push sync cursor (last processed historyId) for incremental fetches.
const HISTORY_KEY = 'peter-pan-payments-history-id';

export async function getSyncHistoryId(): Promise<string | null> {
  try {
    if (!redis) return null;
    return (await redis.get<string>(HISTORY_KEY)) || null;
  } catch {
    return null;
  }
}

export async function setSyncHistoryId(historyId: string): Promise<void> {
  if (!redis) return;
  await redis.set(HISTORY_KEY, historyId);
}

// -------------------- Member matching --------------------

// English (as Zelle spells them) -> Hebrew member name. Zelle notifications
// carry the sender's bank-registered English name, while the site uses Hebrew
// names, so we map explicitly. Extend this list as new members pay.
const memberAliases: { he: string; en: string[] }[] = [
  { he: 'אדיר חזן', en: ['Adir Hazan'] },
  { he: 'עמית תירוש', en: ['Amit Tirosh'] },
  { he: 'אבי לוי', en: ['Avi Levi', 'Avraham Levi', 'Abraham Levi'] },
  { he: 'דני קרן', en: ['Daniel Kern', 'Dani Kern'] },
  { he: 'דודי אמסלם', en: ['Dudi Amsalem', 'David Amsalem'] },
  { he: 'ליאור טמיר', en: ['Lior Tamir'] },
  { he: 'מומי שושן', en: ['Momy Shoshan', 'Momi Shoshan'] },
  { he: 'משה מרקו', en: ['Moshe Marcu', 'Moshe Marco'] },
  { he: 'נדב חורי', en: ['Nadav Houri', 'Nadav Houri'] },
  { he: 'עופר גלעדי', en: ['Ofer Gilady', 'Ofer Giladi'] },
  { he: 'אורן בנבנישתי', en: ['Oren Benvenisti'] },
  { he: 'רם אלמוג', en: ['Ram Almog'] },
  { he: 'רועי וגנר', en: ['Roei Wagner', 'Roi Wagner'] },
  { he: 'רון דיקסון', en: ['Ron Dickson'] },
  { he: 'אורי פייגין', en: ['Ori Feigin'] },
  { he: 'סהר אביאני', en: ['Sahar Aviani'] },
  { he: 'ספי בר', en: ['Safi Bar'] },
  { he: 'שלום מולדבסקי', en: ['Shalom Moldavski', 'Shalom Moldavsky'] },
  { he: 'שלום ספיר', en: ['Shalom Sapir'] },
  { he: 'שי זיידנברג', en: ['Shay Zaidenberg', 'Shai Zaidenberg'] },
  { he: 'שולי מייקלס', en: ['Steven Michaels', 'Shuly Michaels', 'Steven Shuly Michaels'] },
  { he: 'טל שקד', en: ['Tal Shaked'] },
  { he: 'יוסי חכם', en: ['Yossi Chaham', 'Yossi Hacham'] },
  { he: 'יוסי עוז־סיני', en: ['Yossi Oz-Sinai', 'Yossi Oz Sinai'] },
  { he: 'אייל בישרי', en: ['Eyal Bishri'] },
  { he: 'רועי וולקן', en: ['Roee Vulkan', 'Roi Vulkan'] },
  { he: 'איתמר אנקוריון', en: ['Itamar Ankorion'] },
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,'’]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Best-effort match of a raw payer name to a member's Hebrew name.
export function matchMember(payerNameRaw: string): string | null {
  const target = normalize(payerNameRaw);
  if (!target) return null;

  // Exact alias match first.
  for (const m of memberAliases) {
    if (m.en.some((alias) => normalize(alias) === target)) return m.he;
  }

  // Fall back to matching on both first and last name tokens (order-insensitive).
  const targetTokens = new Set(target.split(' '));
  for (const m of memberAliases) {
    for (const alias of m.en) {
      const aliasTokens = normalize(alias).split(' ');
      if (aliasTokens.length >= 2 && aliasTokens.every((t) => targetTokens.has(t))) {
        return m.he;
      }
    }
  }
  return null;
}

// -------------------- Category guessing --------------------

const quarterlyKeywords = ['quarter', 'quarterly', 'dues', 'membership', 'fee', 'fees', 'רבעון', 'רבעוני', 'מיסים', 'דמי חבר', 'חבר'];
const eventKeywords = ['ticket', 'tickets', 'party', 'event', 'bbq', 'game', 'trip', 'dinner', 'כרטיס', 'כרטיסים', 'אירוע', 'מסיבה', 'מונדיאל', 'ארוחה'];

export function guessCategory(memo: string): { category: PaymentCategory; confident: boolean } {
  const m = normalize(memo);
  if (!m) return { category: 'other', confident: false };
  if (quarterlyKeywords.some((k) => m.includes(normalize(k)))) return { category: 'quarterly', confident: true };
  if (eventKeywords.some((k) => m.includes(normalize(k)))) return { category: 'event', confident: true };
  return { category: 'other', confident: false };
}

// -------------------- Zelle email parsing --------------------

// Pull the value that follows a labelled field, tolerating either
// "Label value" on one line or the value on the following line.
function fieldAfter(lines: string[], label: RegExp): string | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (label.test(line)) {
      const sameLine = line.replace(label, '').replace(/^[:\s]+/, '').trim();
      if (sameLine) return sameLine;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim()) return lines[j].trim();
      }
    }
  }
  return null;
}

export interface ParseContext {
  messageId?: string; // email Message-ID, used as the dedup id when there is no txn number
  receivedDate?: Date; // email Date header, used when the body has no explicit date
}

// Parse a Chase Zelle / QuickPay notification. Handles both the newer format
// ("Transaction number", "Sent on", "Memo" on separate lines) and the older
// forwarded QuickPay format ("Amount: $X (USD)", "Memo: ...", no txn number).
// Returns null if it does not look like a Zelle payment email.
export function parseZelleEmail(subject: string, bodyText: string, ctx: ParseContext = {}): Payment | null {
  const text = (bodyText || '').replace(/\r/g, '');
  const lines = text.split('\n');
  const flat = text.replace(/\s+/g, ' ').trim();

  // Payer name: prefer the subject ("[Fw:] <Name> sent you $45.00" or
  // "<Name> sent you money"); fall back to the body. Require capitalized name
  // tokens right before "sent you" so we don't swallow preceding words.
  const nameToken = "[A-Z][A-Za-z'.\\-]+";
  const namePattern = `(${nameToken}(?:\\s+${nameToken}){0,3})\\s+sent you`;
  const cleanSubject = subject.replace(/^\s*(?:fw|fwd|re)\s*:\s*/i, '');
  const payerNameRaw = (
    cleanSubject.match(new RegExp(namePattern))?.[1] ||
    flat.match(new RegExp(namePattern))?.[1] ||
    ''
  ).trim();

  // Transaction number if present; otherwise fall back to the email Message-ID
  // so re-syncing the same email stays idempotent.
  const txn = fieldAfter(lines, /Transaction number/i) || (flat.match(/Transaction number\s*:?\s*(\d+)/i)?.[1] ?? '');
  const txnId = (txn || '').replace(/\D/g, '');
  const id = txnId || (ctx.messageId ? `mid:${ctx.messageId.replace(/[<>]/g, '')}` : '');

  // Amount, e.g. "$250.75" or "Amount: $45.00 (USD)"
  const amountRaw = fieldAfter(lines, /Amount/i) || flat.match(/Amount\s*:?\s*\$?([0-9,]+\.\d{2})/i)?.[1] || '';
  const amount = parseFloat((amountRaw.match(/[0-9,]+\.\d{2}/)?.[0] || amountRaw).replace(/,/g, ''));

  // Date: explicit "Sent on <Month DD, YYYY>" (new format), else the forwarded
  // "Sent: <weekday>, <Month DD, YYYY>" header (QuickPay), else the email date.
  const sentOn = fieldAfter(lines, /Sent on/i) || flat.match(/Sent on\s*:?\s*([A-Za-z]+ \d{1,2},? \d{4})/i)?.[1] || '';
  const forwardedSent = flat.match(/\bSent:\s*(?:[A-Za-z]+,\s*)?([A-Za-z]+ \d{1,2},? \d{4})/i)?.[1] || '';
  const dateSource = sentOn || forwardedSent;
  const parsedDate = dateSource ? new Date(dateSource) : ctx.receivedDate || null;
  const date = parsedDate && !isNaN(parsedDate.getTime())
    ? parsedDate.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  // Memo (may be empty).
  const memo = (fieldAfter(lines, /Memo/i) || '').trim();

  const looksLikeZelle = /zelle|quickpay/i.test(subject) || /sent you money|zelle|quickpay/i.test(flat);
  if (!looksLikeZelle || !id || !payerNameRaw || isNaN(amount)) {
    return null;
  }

  const memberName = matchMember(payerNameRaw);
  const { category, confident } = guessCategory(memo);

  return {
    id,
    payerNameRaw,
    memberName,
    amount,
    currency: 'USD',
    date,
    memo,
    category,
    needsReview: !memberName || !confident,
    syncedAt: new Date().toISOString(),
  };
}
