// Example of how to update data.ts with your Google Drive photos
import { createPhotosFromDriveUrls, convertDriveUrl } from './drive-utils';

// EXAMPLE: How to replace placeholder images with your Google Drive photos

/* 
STEP 1: Get your Google Drive sharing URLs
For each photo in your Google Drive folder:
1. Right-click → "Get link" → "Anyone with the link"
2. Copy the URL (looks like: https://drive.google.com/file/d/ABC123/view?usp=sharing)
3. Add them to arrays like below:
*/

// Example URLs - replace these with your actual Google Drive sharing URLs
const neverlandGalaUrls = [
  'https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing',
  'https://drive.google.com/file/d/2GHI789JKL012/view?usp=sharing',
  'https://drive.google.com/file/d/3MNO345PQR678/view?usp=sharing',
  'https://drive.google.com/file/d/4STU901VWX234/view?usp=sharing',
  'https://drive.google.com/file/d/5YZA567BCD890/view?usp=sharing',
];

const pirateAdventureUrls = [
  'https://drive.google.com/file/d/6EFG123HIJ456/view?usp=sharing',
  'https://drive.google.com/file/d/7KLM789NOP012/view?usp=sharing',
  'https://drive.google.com/file/d/8QRS345TUV678/view?usp=sharing',
  'https://drive.google.com/file/d/9WXY901ZAB234/view?usp=sharing',
];

/* 
STEP 2: Use the utility functions to create photo arrays
*/

const neverlandGalaPhotos = createPhotosFromDriveUrls(
  neverlandGalaUrls,
  [
    'Costume Contest Winners',
    'Peter Pan Flying Scene',
    'Tinker Bell Magic Show',
    'Family Photo Booth',
    'Neverland Decorations'
  ],
  1200, // width
  800   // height
);

const pirateAdventurePhotos = createPhotosFromDriveUrls(
  pirateAdventureUrls,
  [
    'Captain Hook\'s Ship',
    'Treasure Hunt Beginning',
    'Pirate Costume Contest',
    'Walking the Plank Game'
  ],
  1200,
  800
);

/* 
STEP 3: Update your events with the new photo arrays
*/

export const exampleEventWithDrivePhotos = {
  slug: 'neverland-gala',
  title: 'Neverland Gala',
  description: 'An enchanting evening celebrating the magic of Neverland with costume contests and live performances.',
  date: '2023-06-15',
  year: 2023,
  // Cover image from Google Drive
  coverImage: {
    src: convertDriveUrl('https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing'),
    alt: 'Neverland Gala cover image',
    width: 1200,
    height: 800,
  },
  // Photos array from Google Drive
  photos: neverlandGalaPhotos,
};

/* 
STEP 4: Instructions to update your actual data.ts file

1. Replace the neverlandGalaUrls, pirateAdventureUrls etc. with your actual Google Drive URLs
2. Update the photo titles to match your actual photos
3. Copy this pattern to your main data.ts file
4. Replace each event's photos array with your Google Drive photos

Your final data.ts will look like:

import { createPhotosFromDriveUrls, convertDriveUrl } from './drive-utils';

// Your actual Google Drive URLs
const actualEvent1Urls = ['your-actual-urls-here'];
const actualEvent2Urls = ['your-actual-urls-here'];

export const galleryData: Year[] = [
  {
    year: 2023,
    events: [
      {
        slug: 'neverland-gala',
        title: 'Neverland Gala',
        description: 'Your description',
        date: '2023-06-15',
        year: 2023,
        coverImage: {
          src: convertDriveUrl('your-cover-image-drive-url'),
          alt: 'Cover image description',
          width: 1200,
          height: 800,
        },
        photos: createPhotosFromDriveUrls(actualEvent1Urls, ['title1', 'title2', ...])
      },
      // ... more events
    ]
  }
  // ... more years
];
*/

// QUICK START TEMPLATE:
// Just replace the URLs below with your actual Google Drive sharing URLs!

export const quickStartTemplate = `
// Replace these with your actual Google Drive URLs:
const event1Photos = [
  'PASTE_YOUR_DRIVE_URL_HERE',
  'PASTE_YOUR_DRIVE_URL_HERE',
  'PASTE_YOUR_DRIVE_URL_HERE',
];

const event1PhotoTitles = [
  'Photo Title 1',
  'Photo Title 2', 
  'Photo Title 3',
];

// Then use:
photos: createPhotosFromDriveUrls(event1Photos, event1PhotoTitles, 1200, 800)
`;

console.log('Copy this template and replace the URLs with your actual Google Drive URLs:');
console.log(quickStartTemplate);