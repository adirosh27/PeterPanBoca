// Gmail API (OAuth) integration for real-time push sync of Zelle payments.
// This complements the IMAP path: IMAP is the manual "sync now" fallback,
// while this powers instant updates via Gmail push -> Pub/Sub -> our webhook.
//
// Required env vars (set in Vercel + local .env):
//   GMAIL_OAUTH_CLIENT_ID       - OAuth 2.0 client id (Google Cloud)
//   GMAIL_OAUTH_CLIENT_SECRET   - OAuth 2.0 client secret
//   GMAIL_OAUTH_REFRESH_TOKEN   - refresh token for peterpenboca@gmail.com
//                                 (generate with scripts/get-gmail-refresh-token.mjs)
//   GOOGLE_PUBSUB_TOPIC         - full topic name, e.g.
//                                 projects/<project>/topics/gmail-payments
//   PAYMENTS_GMAIL_LABEL        - label to watch (defaults to 'Zelle')
import { google, type gmail_v1 } from 'googleapis';
import { parseZelleEmail, upsertPayments, getSyncHistoryId, setSyncHistoryId, type Payment } from './payments-db';

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

function getGmail(): gmail_v1.Gmail {
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail OAuth is not configured (GMAIL_OAUTH_CLIENT_ID / _SECRET / _REFRESH_TOKEN)');
  }
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth });
}

const LABEL_NAME = () => process.env.PAYMENTS_GMAIL_LABEL || 'Zelle';

async function getLabelId(gmail: gmail_v1.Gmail): Promise<string | undefined> {
  const res = await gmail.users.labels.list({ userId: 'me' });
  const label = (res.data.labels || []).find((l) => l.name === LABEL_NAME());
  return label?.id || undefined;
}

// (Re)start the Gmail watch on the payments label. Must be called at least
// once every 7 days (a daily cron renews it). Stores the baseline historyId.
export async function startWatch(): Promise<{ historyId: string; expiration: string }> {
  const topicName = process.env.GOOGLE_PUBSUB_TOPIC;
  if (!topicName) throw new Error('GOOGLE_PUBSUB_TOPIC is not configured');

  const gmail = getGmail();
  const labelId = await getLabelId(gmail);
  const res = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      topicName,
      labelIds: labelId ? [labelId] : undefined,
      labelFilterBehavior: 'include',
    },
  });
  const historyId = String(res.data.historyId || '');
  if (historyId) await setSyncHistoryId(historyId);
  return { historyId, expiration: String(res.data.expiration || '') };
}

// Extract subject + best-effort body text from a full Gmail message payload.
function extractMessage(msg: gmail_v1.Schema$Message): { subject: string; body: string; messageId?: string; receivedDate?: Date } {
  const headers = msg.payload?.headers || [];
  const header = (name: string) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';
  const subject = header('Subject');
  const messageId = header('Message-ID') || msg.id || undefined;
  const dateHeader = header('Date');
  const receivedDate = dateHeader ? new Date(dateHeader) : msg.internalDate ? new Date(Number(msg.internalDate)) : undefined;

  let textPart = '';
  let htmlPart = '';
  const walk = (part?: gmail_v1.Schema$MessagePart) => {
    if (!part) return;
    const data = part.body?.data;
    if (data) {
      const decoded = Buffer.from(data, 'base64').toString('utf8');
      if (part.mimeType === 'text/plain') textPart += decoded;
      else if (part.mimeType === 'text/html') htmlPart += decoded;
    }
    (part.parts || []).forEach(walk);
  };
  walk(msg.payload);

  const body = textPart || (htmlPart ? htmlToText(htmlPart) : '');
  return { subject, body, messageId, receivedDate: receivedDate && !isNaN(receivedDate.getTime()) ? receivedDate : undefined };
}

async function fetchAndParse(gmail: gmail_v1.Gmail, messageId: string): Promise<Payment | null> {
  const res = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' });
  const { subject, body, messageId: mid, receivedDate } = extractMessage(res.data);
  return parseZelleEmail(subject, body, { messageId: mid, receivedDate });
}

// Handle a push notification: walk Gmail history since the last processed
// historyId, fetch newly-added messages in the label, parse and upsert them.
export async function processHistory(notifiedHistoryId?: string): Promise<{ processed: number; added: number }> {
  const gmail = getGmail();
  const labelId = await getLabelId(gmail);
  const startHistoryId = await getSyncHistoryId();

  // No cursor yet (first run / watch not started): just fetch recent label
  // messages so we don't miss anything, and set the cursor.
  if (!startHistoryId) {
    const list = await gmail.users.messages.list({ userId: 'me', labelIds: labelId ? [labelId] : undefined, maxResults: 25 });
    const parsed: Payment[] = [];
    for (const m of list.data.messages || []) {
      if (m.id) {
        const p = await fetchAndParse(gmail, m.id).catch(() => null);
        if (p) parsed.push(p);
      }
    }
    const added = parsed.length ? await upsertPayments(parsed) : 0;
    if (notifiedHistoryId) await setSyncHistoryId(notifiedHistoryId);
    return { processed: parsed.length, added };
  }

  const messageIds = new Set<string>();
  let pageToken: string | undefined;
  let latestHistoryId = startHistoryId;
  do {
    const res: { data: gmail_v1.Schema$ListHistoryResponse } = await gmail.users.history.list({
      userId: 'me',
      startHistoryId,
      historyTypes: ['messageAdded'],
      labelId: labelId || undefined,
      pageToken,
    });
    for (const h of res.data.history || []) {
      for (const added of h.messagesAdded || []) {
        if (added.message?.id) messageIds.add(added.message.id);
      }
    }
    if (res.data.historyId) latestHistoryId = String(res.data.historyId);
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  const parsed: Payment[] = [];
  for (const id of messageIds) {
    const p = await fetchAndParse(gmail, id).catch(() => null);
    if (p) parsed.push(p);
  }
  const added = parsed.length ? await upsertPayments(parsed) : 0;
  await setSyncHistoryId(notifiedHistoryId || latestHistoryId);
  return { processed: parsed.length, added };
}
