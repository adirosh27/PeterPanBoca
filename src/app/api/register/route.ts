import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations, addRegistration, initDatabase, getRegistrationCount, deleteRegistration } from '@/lib/db';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Registration API called ===');
    
    // Initialize database
    await initDatabase();
    
    const registrationData = await request.json();
    console.log('Registration data received:', {
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email
    });
    
    // Add server timestamp and ID
    const dataWithTimestamp = {
      ...registrationData,
      serverTimestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    console.log('Attempting to save registration...');
    
    // Save registration using the database utility
    const saved = await addRegistration(dataWithTimestamp);
    
    console.log('Database save result:', saved);
    
    if (!saved) {
      console.error('Database save failed - saved returned false');
      throw new Error('Failed to save registration to database');
    }

    console.log('Registration saved successfully, sending emails...');
    
    // Send confirmation email to registrant
    const confirmationSent = await sendConfirmationEmail(registrationData, dataWithTimestamp.id);
    console.log('Confirmation email result:', confirmationSent);
    
    // Send admin notification
    const adminNotificationSent = await sendAdminNotification(registrationData, dataWithTimestamp.id);
    console.log('Admin notification result:', adminNotificationSent);

    // Get updated count
    const totalRegistrations = await getRegistrationCount();
    console.log('Total registrations:', totalRegistrations);
    
    console.log('=== Registration API completed successfully ===');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration saved successfully',
      id: dataWithTimestamp.id,
      totalRegistrations,
      emailSent: confirmationSent,
      adminNotified: adminNotificationSent
    });

  } catch (error) {
    console.error('=== Registration API ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
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

function unauthorized() {
  return NextResponse.json({ success: false, message: 'Wrong admin password', registrations: [] }, { status: 401 });
}

// GET endpoint to retrieve registrations (admin only: header x-admin-password)
export async function GET(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();
  try {
    console.log('GET /api/register - starting');
    
    // Initialize database
    await initDatabase();
    
    // Get all registrations using the database utility
    const registrations = await getAllRegistrations();
    
    console.log('Retrieved registrations:', registrations.length);
    
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error retrieving registrations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        registrations: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE ?id=<registration id> (admin only: header x-admin-password)
export async function DELETE(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
  try {
    const ok = await deleteRegistration(id);
    if (!ok) return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/register:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
