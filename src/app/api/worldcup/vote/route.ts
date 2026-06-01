import { NextRequest, NextResponse } from 'next/server';
import { submitWorldCupVote, deleteWorldCupVote } from '@/lib/worldcup-db';

export async function POST(request: NextRequest) {
  try {
    const { voterName, voterEmail, teamCode } = await request.json();

    if (!voterName || !voterEmail || !teamCode) {
      return NextResponse.json(
        { success: false, message: 'חסרים פרטים נדרשים' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const success = await submitWorldCupVote(voterName, voterEmail, teamCode, ipAddress);

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

    if (!voterEmail) {
      return NextResponse.json(
        { success: false, message: 'חסר מזהה מצביע' },
        { status: 400 }
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
