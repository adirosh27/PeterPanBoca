import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Global in-memory storage for registrations (persists during server runtime)
declare global {
  var registrations: any[] | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    
    // Add server timestamp and ID
    const dataWithTimestamp = {
      ...registrationData,
      serverTimestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Initialize global registrations if it doesn't exist
    if (!global.registrations) {
      global.registrations = [];
    }

    // Always save to global memory (works in both dev and production)
    global.registrations.push(dataWithTimestamp);

    // Also try to save locally for development
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
    } catch (fsError) {
      // Filesystem not available in production, but that's ok - we have memory storage
    }

    // Log for debugging
    console.log('Registration saved:', {
      id: dataWithTimestamp.id,
      name: `${registrationData.firstName} ${registrationData.lastName}`,
      email: registrationData.email,
      event: registrationData.eventName,
      timestamp: dataWithTimestamp.serverTimestamp,
      totalRegistrations: global.registrations.length
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration saved successfully',
      id: dataWithTimestamp.id,
      totalRegistrations: global.registrations.length
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
    // Initialize global registrations if it doesn't exist
    if (!global.registrations) {
      global.registrations = [];
    }

    // First check in-memory storage (works in production)
    const memoryRegistrations = global.registrations || [];
    
    // Also try to merge with filesystem data (development only)
    let fileRegistrations = [];
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'registrations.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      fileRegistrations = JSON.parse(fileContent);
    } catch (fsError) {
      // Filesystem not available or no file - use memory only
    }

    // Merge and deduplicate registrations by ID
    const allRegistrations = [...fileRegistrations, ...memoryRegistrations];
    const uniqueRegistrations = allRegistrations.filter((reg, index, self) => 
      index === self.findIndex((r) => r.id === reg.id)
    );

    // Sort by timestamp (newest first)
    uniqueRegistrations.sort((a, b) => 
      new Date(b.serverTimestamp || b.registrationDate).getTime() - 
      new Date(a.serverTimestamp || a.registrationDate).getTime()
    );

    console.log('GET /api/register - returning registrations:', {
      memoryCount: memoryRegistrations.length,
      fileCount: fileRegistrations.length,
      uniqueCount: uniqueRegistrations.length,
      source: memoryRegistrations.length > 0 ? 'memory+file' : 'file-only'
    });
    
    return NextResponse.json({ 
      success: true, 
      count: uniqueRegistrations.length,
      registrations: uniqueRegistrations,
      source: memoryRegistrations.length > 0 ? 'memory+file' : 'file-only'
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