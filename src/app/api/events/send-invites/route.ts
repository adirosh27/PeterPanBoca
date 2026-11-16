import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { runEventEmails, sendTestInvite, type EmailKind } from '@/lib/event-invites';
import { getMemberEmail } from '@/lib/member-emails';

// Who receives test emails from the admin page's "send me a test" buttons.
const TEST_RECIPIENT_NAME = 'אדיר חזן';

// Daily cron: emails all members a Save the Date for each new event in
// src/lib/events.ts, and a reminder one week before each event.
// Can also be run by hand right after adding an event:
//   /api/events/send-invites?password=<admin password>            (sends)
//   /api/events/send-invites?password=<admin password>&dryRun=1   (preview only)
//   /api/events/send-invites?password=<admin password>&eventId=11&testTo=<member email>
//     (test: one event to one member, nothing marked as sent; add &kind=reminder
//      for the reminder version)
// Auth: the admin password, or the cron's Authorization: Bearer <CRON_SECRET>.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function authorized(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  if (isPaymentsAdmin(searchParams.get('password'))) return true;
  if (isPaymentsAdmin(request.headers.get('x-admin-password'))) return true; // admin pages
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`) return true;
  return false;
}

async function run(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dryRun') === '1';
  try {
    // "Send me a test" button on the admin page: always goes to the site admin only.
    if (request.method === 'POST' && request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      if (body?.test) {
        const kind: EmailKind = body.kind === 'reminder' ? 'reminder' : 'invite';
        const to = getMemberEmail(TEST_RECIPIENT_NAME);
        if (!to) throw new Error('Test recipient not found');
        return NextResponse.json({ success: true, test: await sendTestInvite(Number(body.eventId), to, kind) });
      }
    }
    const testTo = searchParams.get('testTo');
    if (testTo) {
      // Test send of one event to one member; nothing is marked as announced.
      const eventId = Number(searchParams.get('eventId'));
      const kind: EmailKind = searchParams.get('kind') === 'reminder' ? 'reminder' : 'invite';
      return NextResponse.json({ success: true, test: await sendTestInvite(eventId, testTo, kind) });
    }
    const result = await runEventEmails({ dryRun });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error sending event invites:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const GET = run;
export const POST = run;
