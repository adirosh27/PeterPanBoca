import { NextRequest, NextResponse } from 'next/server';
import { processHistory } from '@/lib/payments-google';

// Gmail push webhook: Google Pub/Sub POSTs here whenever a new email lands in
// the watched label. The push subscription URL must include ?token=<secret>
// matching GMAIL_PUSH_TOKEN so random callers can't trigger it.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expected = process.env.GMAIL_PUSH_TOKEN;
    if (expected && searchParams.get('token') !== expected) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Pub/Sub envelope: { message: { data: base64(JSON) }, subscription }
    const envelope = await request.json().catch(() => null);
    let notifiedHistoryId: string | undefined;
    const data = envelope?.message?.data;
    if (data) {
      try {
        const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
        notifiedHistoryId = decoded?.historyId ? String(decoded.historyId) : undefined;
      } catch {
        /* ignore malformed data; processHistory falls back to the stored cursor */
      }
    }

    const result = await processHistory(notifiedHistoryId);
    // Always ack with 200 so Pub/Sub doesn't redeliver on transient parse issues.
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in POST /api/payments/push:', error);
    // Ack anyway (200) to avoid Pub/Sub retry storms; the error is logged.
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
