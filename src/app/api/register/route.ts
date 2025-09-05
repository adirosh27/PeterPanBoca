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
      // Filesystem not available (serverless), use alternative method
      console.log('Filesystem not available, using email notification');
      
      // Send registration via email using Formspree
      const formData = new FormData();
      formData.append('firstName', registrationData.firstName);
      formData.append('lastName', registrationData.lastName);
      formData.append('email', registrationData.email);
      formData.append('phone', registrationData.phone);
      formData.append('eventName', registrationData.eventName);
      formData.append('eventDate', registrationData.eventDate);
      formData.append('adults', registrationData.adults.toString());
      formData.append('children', registrationData.children.toString());
      formData.append('childrenAges', registrationData.childrenAges || 'N/A');
      formData.append('specialRequests', registrationData.specialRequests || 'None');
      formData.append('registrationId', dataWithTimestamp.id);
      formData.append('timestamp', dataWithTimestamp.serverTimestamp);

      // Submit to Formspree for email notification
      const response = await fetch('https://formspree.io/f/mjkveqdk', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Registration submitted successfully - you will receive email confirmation',
          id: dataWithTimestamp.id
        });
      } else {
        const errorText = await response.text();
        console.error('Formspree error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Email submission failed: ${response.status} - ${errorText}`);
      }
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