import { NextRequest, NextResponse } from 'next/server';
import { isAllowedLink, recordClick, SITE_URL } from '@/lib/email-activity';

// Links in event emails go through here: record the click, then forward.
// Only Google Calendar, Google Maps and this site are allowed destinations.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('t');
  const url = request.nextUrl.searchParams.get('u') ?? '';
  if (!isAllowedLink(url)) return NextResponse.redirect(`${SITE_URL}/calendar`, 302);
  if (token) await recordClick(token, url).catch((e) => console.error('recordClick failed:', e));
  return NextResponse.redirect(url, 302);
}
