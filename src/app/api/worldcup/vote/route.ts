import { NextRequest, NextResponse } from 'next/server';
import { submitWorldCupVote, deleteWorldCupVote, isWorldCupAdmin } from '@/lib/worldcup-db';

export async function POST(request: NextRequest) {
  try {
    const { voterName, voterEmail, teamCode, adminPassword } = await request.json();

    if (!voterName || !voterEmail || !teamCode) {
      return NextResponse.json(
        { success: false, message: 'חסרים פרטים נדרשים' },
        { status: 400 }
      );
    }

    const isAdmin = isWorldCupAdmin(adminPassword);

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const success = await submitWorldCupVote(voterName, voterEmail, teamCode, ipAddress, isAdmin);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'לא ניתן לשמור את הניחוש' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'הניחוש נשמר בהצלחה' });
  } catch (error) {
    console.error('Error in POST /api/worldcup/vote:', error);

    if (error instanceof Error && error.message.startsWith('IP_ALREADY_VOTED:')) {
      const name = error.message.split(':')[1];
      return NextResponse.json(
        { success: false, message: `כבר הוצבע ממכשיר זה (${name})` },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'VOTE_LOCKED') {
      return NextResponse.json(
        { success: false, message: 'הניחוש כבר ננעל. רק מנהל יכול לשנות אותו.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה בשמירת הניחוש' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const voterEmail = searchParams.get('voterEmail');
    const adminPassword = searchParams.get('adminPassword');

    if (!voterEmail) {
      return NextResponse.json(
        { success: false, message: 'חסר מזהה מצביע' },
        { status: 400 }
      );
    }

    // Deleting a vote is an admin-only action
    if (!isWorldCupAdmin(adminPassword)) {
      return NextResponse.json(
        { success: false, message: 'מחיקת ניחוש מותרת למנהל בלבד.' },
        { status: 403 }
      );
    }

    const success = await deleteWorldCupVote(voterEmail);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'ההצבעה לא נמצאה' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'הניחוש נמחק' });
  } catch (error) {
    console.error('Error in DELETE /api/worldcup/vote:', error);
    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה במחיקת הניחוש' },
      { status: 500 }
    );
  }
}
