import { NextResponse } from 'next/server';
import { getRegistrationCount } from '@/lib/db';

export async function GET() {
  try {
    const count = await getRegistrationCount();
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      status: 'healthy',
      timestamp,
      registrationCount: count,
      message: 'Database is active and responding'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 500 });
  }
}