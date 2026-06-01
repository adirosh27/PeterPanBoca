import { NextRequest, NextResponse } from 'next/server';
import { isWorldCupAdmin } from '@/lib/worldcup-db';

// Verify an admin password (used by the UI to enter "admin mode")
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');
  return NextResponse.json({ valid: isWorldCupAdmin(password) });
}
