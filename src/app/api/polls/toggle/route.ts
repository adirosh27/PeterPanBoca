import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { setPollActive } from '@/lib/poll-db';

export const dynamic = 'force-dynamic';

// Admin: open or close a poll. Body: { pollId, active }. Header: x-admin-password.
export async function POST(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) {
    return NextResponse.json({ success: false, message: 'Wrong admin password' }, { status: 401 });
  }
  const { pollId, active } = await request.json().catch(() => ({}));
  if (!pollId || typeof active !== 'boolean') {
    return NextResponse.json({ success: false, message: 'pollId and active are required' }, { status: 400 });
  }
  try {
    const ok = await setPollActive(String(pollId), active);
    if (!ok) return NextResponse.json({ success: false, message: 'Poll not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/polls/toggle:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update poll' },
      { status: 500 }
    );
  }
}
