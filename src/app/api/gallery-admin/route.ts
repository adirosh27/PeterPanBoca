import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { deletePhotos, getMode, isDeletablePath, listGallery } from '@/lib/gallery-admin';

export const dynamic = 'force-dynamic';

const MAX_PER_REQUEST = 500;

function unauthorized() {
  return NextResponse.json({ success: false, message: 'Wrong admin password' }, { status: 401 });
}

// List all gallery photos with sizes, grouped by event.
export async function GET(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();
  try {
    const events = await listGallery();
    return NextResponse.json({ success: true, mode: getMode(), events });
  } catch (error) {
    console.error('gallery-admin list error:', error);
    return NextResponse.json(
      { success: false, mode: getMode(), message: error instanceof Error ? error.message : 'Failed to list photos' },
      { status: 500 }
    );
  }
}

// Delete photos. Body: { paths: string[] } (Blob pathnames, under images/).
export async function POST(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();

  let paths: unknown;
  try {
    ({ paths } = await request.json());
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }
  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ success: false, message: 'No photos selected' }, { status: 400 });
  }
  if (paths.length > MAX_PER_REQUEST) {
    return NextResponse.json({ success: false, message: `At most ${MAX_PER_REQUEST} photos per delete` }, { status: 400 });
  }
  const invalid = paths.filter((p) => !isDeletablePath(p));
  if (invalid.length > 0) {
    return NextResponse.json({ success: false, message: `Invalid path(s): ${invalid.slice(0, 3).join(', ')}` }, { status: 400 });
  }

  try {
    const result = await deletePhotos([...new Set(paths as string[])]);
    return NextResponse.json({ success: true, deleted: paths.length, ...result });
  } catch (error) {
    console.error('gallery-admin delete error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
