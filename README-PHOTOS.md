# Adding Your Real Photos

## The Issue with Google Drive

Google Drive doesn't allow direct embedding of photos from sharing URLs due to security restrictions. The website currently shows placeholder photos from Picsum.

## Solutions to Add Your Real Photos

### Option 1: Upload to Imgur (Easiest)
1. Go to https://imgur.com
2. Upload all your photos
3. Get the direct image URLs (right-click → "Copy image address")
4. Replace the placeholder URLs in `src/lib/data.ts`

### Option 2: Use Vercel Blob Storage
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel blob put your-photo.jpg --token YOUR_TOKEN`
3. Use the returned URLs in the website

### Option 3: Use Cloudinary
1. Create free account at https://cloudinary.com
2. Upload photos to your media library
3. Get direct URLs and replace in the data file

### Option 4: Host Images in Public Folder
1. Put all photos in `public/photos/` directory
2. Update URLs to `/photos/your-image.jpg`
3. This will include them directly in the website

## How to Replace the URLs

Edit `src/lib/data.ts` and replace the `allPhotoUrls` array with your actual photo URLs:

```javascript
const allPhotoUrls = [
  'https://your-image-host.com/photo1.jpg',
  'https://your-image-host.com/photo2.jpg',
  // ... all 33 photos
];
```

## Current Status

The website is fully functional with placeholder photos. Once you provide working image URLs, they will display immediately.