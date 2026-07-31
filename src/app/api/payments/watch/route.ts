import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { startWatch } from '@/lib/payments-google';

// Starts/renews the Gmail watch. Gmail watches expire after 7 days, so a daily
// Vercel cron calls this to keep it alive. Auth: either the admin password, or
// the cron's Authorization: Bearer <CRON_SECRET> header.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorized(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  if (isPaymentsAdmin(searchParams.get('password'))) return true;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`) return true;
  return false;
}

async function run(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
  }
  try {
    const result = await startWatch();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error starting Gmail watch:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET is used by the Vercel cron; POST by the admin UI.
export const GET = run;
export const POST = run;
