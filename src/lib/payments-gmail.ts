// Gmail/IMAP sync for the payments store. Server-only: connects to the group
// Gmail account with an app password, reads the configured label, and upserts
// any Chase Zelle notifications it can parse.
//
// Required env vars (set in Vercel + local .env):
//   GMAIL_IMAP_USER          - e.g. peterpanboca@gmail.com
//                              (falls back to the existing GMAIL_USER)
//   GMAIL_IMAP_APP_PASSWORD  - a Gmail app password (needs 2FA on the account)
//                              (falls back to the existing GMAIL_APP_PASSWORD)
//   PAYMENTS_GMAIL_LABEL     - label/folder to read (defaults to INBOX)
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { parseZelleEmail, upsertPayments, type Payment } from './payments-db';

// Turn a Chase HTML email into line-structured text so the label/value pairs
// (Amount, Sent on, Transaction number, Memo) survive on their own lines.
function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|tr|td|th|h[1-6]|li)\s*>/gi, '\n')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]*\n+/g, '\n')
    .trim();
}

export interface SyncResult {
  scanned: number;
  parsed: number;
  added: number;
  label: string;
}

// Resolve + sanitize IMAP credentials. Google shows app passwords as four
// space-separated groups; the actual password is the 16 chars with no spaces,
// so we strip whitespace (a very common source of AUTHENTICATIONFAILED).
function getCreds(): { user: string; pass: string } {
  const user = (process.env.GMAIL_IMAP_USER || process.env.GMAIL_USER || '').trim();
  const pass = (process.env.GMAIL_IMAP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  if (!user || !pass) {
    throw new Error('Gmail IMAP credentials are not configured (GMAIL_IMAP_USER/GMAIL_USER + GMAIL_IMAP_APP_PASSWORD/GMAIL_APP_PASSWORD)');
  }
  return { user, pass };
}

// Diagnostic: try both credential pairs and report which (if any) authenticates.
// Reveals a typo'd user or a bad/short app password without exposing the password.
export async function testAuth(): Promise<unknown> {
  const pairs = [
    { name: 'IMAP-specific', user: (process.env.GMAIL_IMAP_USER || '').trim(), pass: (process.env.GMAIL_IMAP_APP_PASSWORD || '').replace(/\s+/g, '') },
    { name: 'shared GMAIL_*', user: (process.env.GMAIL_USER || '').trim(), pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '') },
  ];
  const results = [];
  for (const p of pairs) {
    const entry: Record<string, unknown> = { name: p.name, user: p.user, passLength: p.pass.length };
    if (!p.user || !p.pass) {
      entry.ok = false;
      entry.error = 'missing user or password';
      results.push(entry);
      continue;
    }
    const client = new ImapFlow({ host: 'imap.gmail.com', port: 993, secure: true, auth: { user: p.user, pass: p.pass }, logger: false });
    try {
      await client.connect();
      entry.ok = true;
      await client.logout().catch(() => {});
    } catch (err) {
      const e = err as Record<string, unknown>;
      entry.ok = false;
      entry.error = e?.responseText || e?.message;
    }
    results.push(entry);
  }
  return results;
}

// Diagnostic: list the account's mailbox/label paths so we can confirm the
// exact PAYMENTS_GMAIL_LABEL value to use.
export async function listMailboxes(): Promise<string[]> {
  const { user, pass } = getCreds();
  const client = new ImapFlow({ host: 'imap.gmail.com', port: 993, secure: true, auth: { user, pass }, logger: false });
  await client.connect();
  try {
    const boxes = await client.list();
    return boxes.map((b) => b.path);
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function syncPaymentsFromGmail(): Promise<SyncResult> {
  const { user, pass } = getCreds();
  const label = process.env.PAYMENTS_GMAIL_LABEL || 'INBOX';

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  const parsedPayments: Payment[] = [];
  let scanned = 0;

  await client.connect();
  try {
    let lock;
    try {
      lock = await client.getMailboxLock(label);
    } catch (err) {
      const available = (await client.list().catch(() => [])).map((b) => b.path);
      throw new Error(
        `Could not open label "${label}". Available mailboxes: ${available.join(' | ') || '(none listed)'}`
      );
    }
    try {
      // Only Chase Zelle notifications are of interest.
      let uids = await client.search({ from: 'chase' }, { uid: true });
      if (!uids || uids.length === 0) {
        // Fall back to scanning the whole label if the FROM filter finds nothing.
        uids = await client.search({ all: true }, { uid: true });
      }
      if (uids && uids.length > 0) {
        for await (const msg of client.fetch(uids, { uid: true, source: true }, { uid: true })) {
          scanned++;
          try {
            const mail = await simpleParser(msg.source as Buffer);
            const body = mail.text || (mail.html ? htmlToText(mail.html) : '');
            const payment = parseZelleEmail(mail.subject || '', body);
            if (payment) parsedPayments.push(payment);
          } catch (err) {
            console.error('Failed to parse a message during payments sync:', err);
          }
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }

  const added = parsedPayments.length > 0 ? await upsertPayments(parsedPayments) : 0;
  return { scanned, parsed: parsedPayments.length, added, label };
}
