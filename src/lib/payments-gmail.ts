// Gmail/IMAP sync for the payments store. Server-only: connects to the group
// Gmail account with an app password, reads the configured label, and upserts
// any Chase Zelle notifications it can parse.
//
// Required env vars (set in Vercel + local .env):
//   GMAIL_IMAP_USER          - e.g. peterpanboca@gmail.com
//   GMAIL_IMAP_APP_PASSWORD  - a Gmail app password (needs 2FA on the account)
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

export async function syncPaymentsFromGmail(): Promise<SyncResult> {
  const user = process.env.GMAIL_IMAP_USER;
  const pass = process.env.GMAIL_IMAP_APP_PASSWORD;
  const label = process.env.PAYMENTS_GMAIL_LABEL || 'INBOX';

  if (!user || !pass) {
    throw new Error('GMAIL_IMAP_USER / GMAIL_IMAP_APP_PASSWORD are not configured');
  }

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
    const lock = await client.getMailboxLock(label);
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
