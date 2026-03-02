import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

let manifestCache: Record<string, { urlPrefix: string; images: { name: string; url: string }[] }> | null = null;

function getManifest() {
  if (manifestCache) return manifestCache;
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'image-manifest.json');
    manifestCache = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    return manifestCache;
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const eventFolder = searchParams.get('event');

    if (!year || !eventFolder) {
      return NextResponse.json({
        success: false,
        message: 'Year and event parameters are required'
      }, { status: 400 });
    }

    const manifest = getManifest();
    const key = `${year}/${eventFolder}`;
    const entry = manifest?.[key];

    if (entry && entry.images.length > 0) {
      return NextResponse.json({
        success: true,
        images: entry.images,
        totalCount: entry.images.length
      });
    }

    return NextResponse.json({
      success: false,
      message: `Event folder not found: ${eventFolder}`,
      images: [],
      totalCount: 0
    });
  } catch (error) {
    console.error('Photos API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
