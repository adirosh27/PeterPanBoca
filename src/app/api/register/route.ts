import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations, addRegistration, initDatabase, getRegistrationCount } from '@/lib/db';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initDatabase();
    
    const registrationData = await request.json();
    
    // Add server timestamp and ID
    const dataWithTimestamp = {
      ...registrationData,
      serverTimestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Save registration using the database utility
    const saved = await addRegistration(dataWithTimestamp);
    
    if (!saved) {
      throw new Error('Failed to save registration to database');
    }

    // Send confirmation email to registrant
    const confirmationSent = await sendConfirmationEmail(registrationData, dataWithTimestamp.id);
    
    // Send admin notification
    const adminNotificationSent = await sendAdminNotification(registrationData, dataWithTimestamp.id);

    // Get updated count
    const totalRegistrations = await getRegistrationCount();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration saved successfully',
      id: dataWithTimestamp.id,
      totalRegistrations,
      emailSent: confirmationSent,
      adminNotified: adminNotificationSent
    });

  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve registrations (for admin use)
export async function GET() {
  try {
    // Initialize database
    await initDatabase();
    
    // Get all registrations using the database utility
    const registrations = await getAllRegistrations();
    
    // Sort by timestamp (newest first)
    registrations.sort((a, b) => 
      new Date(b.serverTimestamp || b.registrationDate).getTime() - 
      new Date(a.serverTimestamp || a.registrationDate).getTime()
    );

    console.log('GET /api/register - returning registrations:', {
      count: registrations.length,
      source: 'database'
    });
    
    return NextResponse.json({ 
      success: true, 
      count: registrations.length,
      registrations: registrations,
      source: 'database'
    });
  } catch (error) {
    console.error('Error in GET /api/register:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error retrieving registrations',
        registrations: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}