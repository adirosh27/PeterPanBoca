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
      id: Date.now().toString() // Simple unique ID
    };

    // Define the data directory and file path
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'registrations.json');

    // Ensure data directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists, ignore
    }

    // Read existing data or create empty array
    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      existingData = [];
    }

    // Add new registration
    existingData.push(dataWithTimestamp);

    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Registration saved successfully',
      id: dataWithTimestamp.id
    });

  } catch (error) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save registration' },
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