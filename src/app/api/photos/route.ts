import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const eventFolder = searchParams.get('event');

    if (!year || !eventFolder) {
      return NextResponse.json({ 
        success: false, 
        message: 'Year and event parameters are required' 
      }, { status: 400 });
    }

    // Try Photos directory first, then fall back to images directory
    const photosDir = path.join(process.cwd(), 'public', 'Photos', year, eventFolder);
    const imagesDir = path.join(process.cwd(), 'public', 'images', year, eventFolder);
    
    let targetDir = photosDir;
    let urlPrefix = 'Photos';
    
    // Check if Photos directory exists, otherwise use images directory
    if (!existsSync(photosDir) && existsSync(imagesDir)) {
      targetDir = imagesDir;
      urlPrefix = 'images';
    }
    
    try {
      const files = await readdir(targetDir);
      
      // Filter for image files only
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );
      
      // Create URLs for the images
      const imageUrls = imageFiles.map(file => ({
        name: file,
        url: `/${urlPrefix}/${year}/${eventFolder}/${file}`
      }));

      return NextResponse.json({
        success: true,
        images: imageUrls,
        totalCount: imageUrls.length
      });
      
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: `Event folder not found: ${eventFolder}`,
        images: [],
        totalCount: 0
      });
    }
  } catch (error) {
    console.error('Photos API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}