// Utility functions for working with Google Drive photos

/**
 * Converts a Google Drive sharing URL to a direct image URL
 * @param shareUrl - The sharing URL from Google Drive (e.g., "https://drive.google.com/file/d/FILE_ID/view?usp=sharing")
 * @returns Direct image URL that can be used in <img> tags
 */
export function convertDriveUrl(shareUrl: string): string {
  // If it's not a Google Drive URL, return as-is
  if (!shareUrl.includes('drive.google.com')) {
    return shareUrl;
  }
  
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  
  if (!fileIdMatch) {
    console.error('Could not extract file ID from URL:', shareUrl);
    return shareUrl; // Return original URL as fallback
  }
  
  const fileId = fileIdMatch[1];
  // Try a different format that might work better
  return `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;
}

/**
 * Batch convert multiple Google Drive URLs
 * @param urls - Array of Google Drive sharing URLs
 * @returns Array of direct image URLs
 */
export function convertMultipleDriveUrls(urls: string[]): string[] {
  return urls.map(url => convertDriveUrl(url));
}

/**
 * Helper to create photo objects from Google Drive URLs
 * @param urls - Array of Google Drive sharing URLs
 * @param titles - Optional array of photo titles
 * @param width - Default width (can be overridden per photo)
 * @param height - Default height (can be overridden per photo)
 * @returns Array of Photo objects ready for the gallery
 */
export function createPhotosFromDriveUrls(
  urls: string[], 
  titles?: string[], 
  width: number = 800, 
  height: number = 600
) {
  return urls.map((url, index) => ({
    src: convertDriveUrl(url),
    alt: titles?.[index] || `Photo ${index + 1}`,
    width,
    height,
    title: titles?.[index]
  }));
}

// Example usage:
/*
const driveUrls = [
  'https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing',
  'https://drive.google.com/file/d/2GHI789JKL012/view?usp=sharing',
  'https://drive.google.com/file/d/3MNO345PQR678/view?usp=sharing'
];

const photos = createPhotosFromDriveUrls(
  driveUrls,
  ['Captain Hook at the helm', 'Pirate ship adventure', 'Treasure hunt finale'],
  1200, // width
  800   // height
);
*/