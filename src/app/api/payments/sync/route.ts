import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { syncPaymentsFromGmail } from '@/lib/payments-gmail';

// IMAP needs the Node.js runtime and must not be statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
