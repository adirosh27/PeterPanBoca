import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { getActivity, type ActivityKind } from '@/lib/email-activity';

// Admin: who was sent / opened / clicked one event email.
//   GET /api/events/activity?eventId=11&kind=invite|reminder|test
//   header x-admin-password: <admin password>
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KINDS: ActivityKind[] = ['invite', 'reminder', 'test'];

export async function GET(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) {
    return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = request.nextUrl;
  const eventId = Number(searchParams.get('eventId'));
  const kind = (searchParams.get('kind') ?? 'invite') as ActivityKind;
  if (!Number.isFinite(eventId) || !KINDS.includes(kind)) {
    return NextResponse.json({ success: false, message: 'bad eventId or kind' }, { status: 400 });
  }
  try {
    return NextResponse.json({ success: true, ...(await getActivity(eventId, kind)) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
