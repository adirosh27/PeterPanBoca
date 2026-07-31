import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin, updatePayment, deletePayment, type PaymentCategory } from '@/lib/payments-db';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: PaymentCategory[] = ['event', 'quarterly', 'other'];

// Admin manual-review: assign a member and/or category to a payment.
export async function POST(request: NextRequest) {
  try {
    const { id, memberName, category, adminPassword } = await request.json();

    if (!isPaymentsAdmin(adminPassword)) {
      return NextResponse.json(
        { success: false, message: 'עריכת תשלום מותרת למנהל בלבד.' },
        { status: 403 }
      );
    }
    if (!id) {
      return NextResponse.json({ success: false, message: 'חסר מזהה תשלום' }, { status: 400 });
    }
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ success: false, message: 'קטגוריה לא חוקית' }, { status: 400 });
    }

    const ok = await updatePayment(
      id,
      {
        ...(memberName !== undefined ? { memberName } : {}),
        ...(category !== undefined ? { category } : {}),
      },
      'admin'
    );

    if (!ok) {
      return NextResponse.json({ success: false, message: 'התשלום לא נמצא' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'התשלום עודכן' });
  } catch (error) {
    console.error('Error in POST /api/payments/update:', error);
    return NextResponse.json({ success: false, message: 'אירעה שגיאה בעדכון' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const adminPassword = searchParams.get('adminPassword');

    if (!isPaymentsAdmin(adminPassword)) {
      return NextResponse.json(
        { success: false, message: 'מחיקת תשלום מותרת למנהל בלבד.' },
        { status: 403 }
      );
    }
    if (!id) {
      return NextResponse.json({ success: false, message: 'חסר מזהה תשלום' }, { status: 400 });
    }

    const ok = await deletePayment(id);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'התשלום לא נמצא' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'התשלום נמחק' });
  } catch (error) {
    console.error('Error in DELETE /api/payments/update:', error);
    return NextResponse.json({ success: false, message: 'אירעה שגיאה במחיקה' }, { status: 500 });
  }
}
