import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { syncPaymentsFromGmail, listMailboxes } from '@/lib/payments-gmail';

// IMAP needs the Node.js runtime and must not be statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Diagnostic: GET ?action=mailboxes&password=... lists the account's labels.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (!isPaymentsAdmin(searchParams.get('password'))) {
    return NextResponse.json({ success: false, message: 'admin only' }, { status: 403 });
  }
  if (searchParams.get('action') === 'mailboxes') {
    try {
      const mailboxes = await listMailboxes();
      return NextResponse.json({ success: true, mailboxes });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ success: false, message: 'unknown action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const { adminPassword } = await request.json().catch(() => ({}));

    if (!isPaymentsAdmin(adminPassword)) {
      return NextResponse.json(
        { success: false, message: 'סנכרון תשלומים מותר למנהל בלבד.' },
        { status: 403 }
      );
    }

    const result = await syncPaymentsFromGmail();
    return NextResponse.json({
      success: true,
      message: `נסרקו ${result.scanned} הודעות, נמצאו ${result.parsed} תשלומים (${result.added} חדשים).`,
      ...result,
    });
  } catch (error) {
    console.error('Error in POST /api/payments/sync:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'הסנכרון נכשל',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
