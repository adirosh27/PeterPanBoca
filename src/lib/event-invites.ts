// Event emails to every active member. SERVER-SIDE ONLY (member emails, Gmail, Redis).
//  - "Save the Date" when a new event is added to src/lib/events.ts
//  - a reminder one week before the event
// A daily cron runs runEventEmails(). Redis sets record what was already sent.
// The very first run only records the events that exist at that point (no
// Save the Date for them); their reminders still go out a week before.
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';
import { events, TBA, type Event } from '@/lib/events';
import { getActiveMemberEmails, memberEmails } from '@/lib/member-emails';
import { googleCalendarUrl, googleMapsUrl, icsContent, type CalendarEventInfo } from '@/lib/calendar-links';

const SENT_KEY = 'peter-pan-event-invites-sent';
const REMINDED_KEY = 'peter-pan-event-reminders-sent';
const REMINDER_DAYS = 7;

export type EmailKind = 'invite' | 'reminder';
const SUBJECT_SUFFIX = 'מפגש פיטר פן';
const SITE_URL = 'https://peter-pan-boca.vercel.app';

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

const known = (value: string) => (value && value !== TBA ? value : undefined);

function toCalendarInfo(event: Event): CalendarEventInfo {
  return {
    title: event.title,
    date: event.date,
    endDate: event.endDate,
    time: known(event.time),
    location: known(event.location),
    description: event.description,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/New_York',
  });

const dayAndMonth = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', timeZone: 'America/New_York' });

// Today's date (YYYY-MM-DD) in the group's time zone
const todayInNewYork = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// Whole days from `from` to `to` (both YYYY-MM-DD)
const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

const daysLeftText = (days: number) =>
  days === 7 ? 'עוד שבוע!' : days === 1 ? 'מחר!' : `עוד ${days} ימים!`;

// "Save the Date" / reminder email: big date, title, the known details, and
// one-tap buttons to save the event (Google link + attached .ics).
export function buildInviteEmail(event: Event, kind: EmailKind = 'invite') {
  const reminder = kind === 'reminder';
  const daysLeft = daysBetween(todayInNewYork(), event.date);
  const [headerEn, headerHe] = reminder
    ? ['REMINDER', `תזכורת – ${daysLeftText(daysLeft)}`]
    : ['SAVE THE DATE', 'שמרו את התאריך'];
  const info = toCalendarInfo(event);
  const start = new Date(`${event.date}T12:00:00`);
  const weekday = start.toLocaleDateString('he-IL', { weekday: 'long', timeZone: 'America/New_York' });
  const bigDay = event.endDate
    ? `${start.getDate()}–${new Date(`${event.endDate}T12:00:00`).getDate()}`
    : String(start.getDate());
  const monthYear = start.toLocaleDateString('he-IL', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const dateText = event.endDate
    ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
    : formatDate(event.date);
  const location = known(event.location);

  const rows: [string, string, string?][] = [
    ['⏰ שעה', event.time],
    ['📍 מיקום', event.location, location && googleMapsUrl(location)],
    ['💵 מחיר', event.price],
    ['👥 למי', event.ageGroup],
  ].filter(([, value]) => value?.trim()) as [string, string, string?][];

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:16px;background:#ecfdf5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;direction:rtl;text-align:right">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(6,95,70,.12)">
    <div style="background:linear-gradient(135deg,#047857,#10b981 60%,#34d399);padding:24px 24px 28px;text-align:center;color:#ffffff">
      <img src="${SITE_URL}/images/email-logo.png" width="96" height="95" alt="Peter Pan Boca"
           style="display:block;margin:0 auto 14px;width:96px;height:auto;border:0" />
      <div style="font-size:13px;letter-spacing:6px;font-weight:bold;opacity:.9;direction:ltr">${headerEn}</div>
      <div style="font-size:15px;margin-top:4px;opacity:.95">${escapeHtml(headerHe)}</div>
      <div style="margin:22px auto 0;display:inline-block;background:#ffffff;color:#065f46;border-radius:16px;padding:14px 28px;box-shadow:0 6px 16px rgba(0,0,0,.15)">
        <div style="font-size:14px;color:#10b981;font-weight:bold">${escapeHtml(weekday)}</div>
        <div style="font-size:52px;line-height:1.05;font-weight:bold;direction:ltr">${bigDay}</div>
        <div style="font-size:16px;font-weight:bold">${escapeHtml(monthYear)}</div>
      </div>
      <h1 style="margin:22px 0 0;font-size:26px;line-height:1.3">${escapeHtml(event.title)}</h1>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7">${escapeHtml(event.description)}</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:15px">
        ${rows
          .map(
            ([label, value, href]) => `<tr>
          <td style="padding:10px 0;border-top:1px solid #d1fae5;color:#065f46;font-weight:bold;white-space:nowrap;vertical-align:top">${label}</td>
          <td style="padding:10px 12px 10px 0;border-top:1px solid #d1fae5">${
            href ? `<a href="${escapeHtml(href)}" style="color:#047857">${escapeHtml(value)}</a>` : escapeHtml(value)
          }</td>
        </tr>`
          )
          .join('')}
      </table>
      <div style="text-align:center;margin:26px 0 6px">
        <a href="${escapeHtml(googleCalendarUrl(info))}"
           style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:999px">
          📅 שמירה ב-Google Calendar
        </a>
      </div>
      <p style="text-align:center;font-size:13px;color:#6b7280;margin:10px 0 0;line-height:1.6">
        ביומן של אייפון או Outlook? פתחו את הקובץ המצורף <b>event.ics</b> והאירוע יתווסף ליומן.
      </p>
      <p style="text-align:center;font-size:13px;margin:22px 0 0">
        <a href="${SITE_URL}/calendar" style="color:#047857">לכל האירועים ביומן של פיטר פן</a>
      </p>
    </div>
  </div>
  <p style="text-align:center;font-size:12px;color:#6b7280;margin:14px 0 0">🧚 Peter Pan Boca</p>
</body>
</html>`;

  const text = [
    `${headerEn} – ${headerHe}`,
    '',
    event.title,
    `📅 ${dateText}`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    event.description,
    '',
    `שמירה ב-Google Calendar: ${googleCalendarUrl(info)}`,
    'לאייפון / Outlook: פתחו את הקובץ המצורף event.ics',
    '',
    `לכל האירועים: ${SITE_URL}/calendar`,
  ].join('\n');

  return {
    subject: reminder
      ? `⏰ תזכורת: ${event.title} – ${daysLeftText(daysLeft).replace('!', '')} (${dayAndMonth(event.date)}) - ${SUBJECT_SUFFIX}`
      : `📅 Save the Date: ${event.title} – ${dayAndMonth(event.date)} - ${SUBJECT_SUFFIX}`,
    html,
    text,
    ics: icsContent(info),
  };
}

// The site's Gmail account (the Peter Pan account), exactly as the registration
// confirmation emails in src/lib/email.ts use it.
const senderAddress = () => (process.env.GMAIL_USER || '').trim();

export function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

export async function sendInvite(transporter: nodemailer.Transporter, event: Event, to: string, kind: EmailKind = 'invite') {
  const mail = buildInviteEmail(event, kind);
  await transporter.sendMail({
    from: `"Peter Pan Boca" <${senderAddress()}>`,
    to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: [{ filename: 'event.ics', content: mail.ics, contentType: 'text/calendar; charset=utf-8' }],
  });
}

const notConfigured = () =>
  new Error('Gmail is not configured (GMAIL_USER / GMAIL_APP_PASSWORD)');

// Test send: one event to one member, without marking anything as sent.
export async function sendTestInvite(eventId: number, to: string, kind: EmailKind = 'invite') {
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error(`No event with id ${eventId}`);
  if (!memberEmails.some((m) => m.email.toLowerCase() === to.toLowerCase())) {
    throw new Error('Test emails can only go to a member address');
  }
  const transporter = createTransporter();
  if (!transporter) throw notConfigured();
  await sendInvite(transporter, event, to, kind);
  return { eventId, title: event.title, to, kind, from: senderAddress() };
}

interface SentReport {
  eventId: number;
  title: string;
  delivered: number;
  failed: string[];
}

export interface EventEmailsResult {
  baseline: boolean; // first run: existing events recorded, no Save the Date for them
  invites: SentReport[];
  reminders: SentReport[];
  dryRun: boolean;
}

// One email per member, so nobody sees the others' addresses.
async function sendToAll(transporter: nodemailer.Transporter, event: Event, kind: EmailKind): Promise<SentReport> {
  const recipients = getActiveMemberEmails();
  const failed: string[] = [];
  for (const to of recipients) {
    try {
      await sendInvite(transporter, event, to, kind);
    } catch (error) {
      console.error(`Event ${kind} ${event.id} to ${to} failed:`, error);
      failed.push(to);
    }
  }
  return { eventId: event.id, title: event.title, delivered: recipients.length - failed.length, failed };
}

export async function runEventEmails({ dryRun = false } = {}): Promise<EventEmailsResult> {
  if (!redis) throw new Error('Redis is not configured');

  const result: EventEmailsResult = { baseline: false, invites: [], reminders: [], dryRun };
  const today = todayInNewYork();
  const upcoming = (e: Event) => (e.endDate ?? e.date) >= today;
  const ids = (list: Event[]) => list.map((e) => String(e.id)) as [string, ...string[]];

  // Work out what is due before sending anything.
  let newEvents: Event[];
  if (!(await redis.exists(SENT_KEY))) {
    result.baseline = true;
    newEvents = [];
    if (!dryRun && events.length) await redis.sadd(SENT_KEY, ...ids(events));
  } else {
    const sent = new Set((await redis.smembers(SENT_KEY)).map(String));
    newEvents = events.filter((e) => !sent.has(String(e.id)));
  }
  const reminded = new Set((await redis.smembers(REMINDED_KEY)).map(String));
  const dueReminders = events.filter((e) => {
    const days = daysBetween(today, e.date);
    return days >= 1 && days <= REMINDER_DAYS && !reminded.has(String(e.id));
  });

  const transporter = dryRun ? null : createTransporter();
  if (!dryRun && !transporter && (newEvents.some(upcoming) || dueReminders.length)) throw notConfigured();

  // Save the Date for new events (past ones are just recorded).
  for (const event of newEvents) {
    const due = upcoming(event);
    if (dryRun) {
      if (due) result.invites.push({ eventId: event.id, title: event.title, delivered: 0, failed: [] });
      continue;
    }
    // Claim first so two overlapping runs never email the same event twice.
    if ((await redis.sadd(SENT_KEY, String(event.id))) === 0 || !due) continue;
    result.invites.push(await sendToAll(transporter!, event, 'invite'));
  }

  // Reminders, a week before. An event added less than a week ahead just got
  // its Save the Date, so it doesn't also get a reminder.
  const justInvited = new Set(result.invites.map((r) => r.eventId));
  for (const event of dueReminders) {
    if (dryRun) {
      if (!justInvited.has(event.id)) result.reminders.push({ eventId: event.id, title: event.title, delivered: 0, failed: [] });
      continue;
    }
    if ((await redis.sadd(REMINDED_KEY, String(event.id))) === 0 || justInvited.has(event.id)) continue;
    result.reminders.push(await sendToAll(transporter!, event, 'reminder'));
  }

  return result;
}

// Admin "send to everyone" for one event's Save the Date (e.g. an event that
// existed before the daily job started, so it never got one). Records it as
// sent so the daily job won't send it again. Refuses a second send unless
// `force` is set.
export async function sendSaveTheDateToAll(eventId: number, { force = false } = {}) {
  if (!redis) throw new Error('Redis is not configured');
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error(`No event with id ${eventId}`);
  if ((event.endDate ?? event.date) < todayInNewYork()) throw new Error('This event is already over');

  const transporter = createTransporter();
  if (!transporter) throw notConfigured();

  // Before the first daily run: record existing events first, so that run
  // doesn't treat them as new.
  if (!(await redis.exists(SENT_KEY))) {
    const all = events.map((e) => String(e.id)) as [string, ...string[]];
    await redis.sadd(SENT_KEY, ...all);
    await redis.srem(SENT_KEY, String(event.id));
  }

  const isNew = (await redis.sadd(SENT_KEY, String(event.id))) === 1;
  if (!isNew && !force) {
    throw new Error('ALREADY_SENT: this event\'s Save the Date was already sent to everyone');
  }
  // Within a week of the event, this email is the reminder too.
  const days = daysBetween(todayInNewYork(), event.date);
  if (days >= 1 && days <= REMINDER_DAYS) await redis.sadd(REMINDED_KEY, String(event.id));

  return sendToAll(transporter, event, 'invite');
}
