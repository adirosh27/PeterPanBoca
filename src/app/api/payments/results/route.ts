import { NextResponse } from 'next/server';
import { getPayments } from '@/lib/payments-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payments = await getPayments();
    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('Error in GET /api/payments/results:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get payments' },
      { status: 500 }
    );
  }
}
