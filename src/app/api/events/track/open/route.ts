import { NextRequest } from 'next/server';
import { recordOpen } from '@/lib/email-activity';

// 1x1 transparent GIF in event emails; records that the member opened it.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('t');
  if (token) await recordOpen(token).catch((e) => console.error('recordOpen failed:', e));
  return new Response(GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}
