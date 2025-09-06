import { NextResponse } from 'next/server';
import { getAllRegistrations, getRegistrationCount } from '@/lib/db';

export async function GET() {
  try {
    const registrations = await getAllRegistrations();
    const count = await getRegistrationCount();
    
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      gmailUserLength: process.env.GMAIL_USER ? process.env.GMAIL_USER.length : 0,
    };
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      registrationCount: count,
      hasRegistrations: registrations.length > 0,
      recentRegistrations: registrations.slice(0, 3).map(r => ({
        id: r.id,
        name: `${r.firstName} ${r.lastName}`,
        email: r.email.substring(0, 3) + '***', // Partially hide email for security
        timestamp: r.serverTimestamp || r.registrationDate
      })),
      environmentCheck: envCheck,
      message: 'Test endpoint working'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Test endpoint failed'
    });
  }
}