import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// GET endpoint to download registrations as Excel file
export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const jsonFilePath = path.join(dataDir, 'registrations.json');
    
    // Read JSON data
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const registrations = JSON.parse(fileContent);
    
    // Convert to Excel format
    const excelData = registrations.map((reg: any) => ({
      'ID': reg.id,
      'First Name': reg.firstName,
      'Last Name': reg.lastName,
      'Email': reg.email,
      'Phone': reg.phone,
      'Event Name': reg.eventName,
      'Event Date': reg.eventDate,
      'Event Price': reg.eventPrice,
      'Adults': reg.adults,
      'Children': reg.children,
      'Children Ages': reg.childrenAges || 'N/A',
      'Special Requests': reg.specialRequests || 'None',
      'Registration Date': reg.registrationDate,
      'Server Timestamp': reg.serverTimestamp
    }));
    
    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 25 },
      { width: 15 }, { width: 30 }, { width: 20 }, { width: 10 },
      { width: 8 }, { width: 8 }, { width: 15 }, { width: 30 },
      { width: 15 }, { width: 20 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    
    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Return as downloadable file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
    
  } catch (error) {
    console.error('Error creating Excel download:', error);
    return NextResponse.json(
      { success: false, message: 'No registrations found or error creating Excel file' },
      { status: 404 }
    );
  }
}