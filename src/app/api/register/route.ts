import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    
    // Add server timestamp
    const dataWithTimestamp = {
      ...registrationData,
      serverTimestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Try to save locally (works in development)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'registrations.json');

      await fs.mkdir(dataDir, { recursive: true });

      let existingData = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        existingData = [];
      }

      existingData.push(dataWithTimestamp);
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Registration saved successfully',
        id: dataWithTimestamp.id
      });
    } catch (fsError) {
      // Filesystem not available (serverless), log the registration data
      console.log('Filesystem not available, logging registration data:', {
        id: dataWithTimestamp.id,
        name: `${registrationData.firstName} ${registrationData.lastName}`,
        email: registrationData.email,
        event: registrationData.eventName,
        timestamp: dataWithTimestamp.serverTimestamp
      });
      
      // For now, return success (you can set up proper email notification later)
      return NextResponse.json({ 
        success: true, 
        message: 'Registration submitted successfully - data has been logged',
        id: dataWithTimestamp.id
      });
    }

  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save registration',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve registrations (for admin use)
export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'registrations.json');
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const registrations = JSON.parse(fileContent);
    
    return NextResponse.json({ 
      success: true, 
      count: registrations.length,
      registrations 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'No registrations found' },
      { status: 404 }
    );
  }
}