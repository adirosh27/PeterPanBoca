import { createPhotosFromDriveUrls, convertDriveUrl } from './drive-utils';

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
}

export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  year: number;
  coverImage: Photo;
  photos: Photo[];
  videosUrl?: string;
}

export interface Year {
  year: number;
  events: Event[];
}

// Temporary placeholder photos while Google Drive access is resolved
const allPhotoUrls = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3',
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
  'https://picsum.photos/800/600?random=6',
  'https://picsum.photos/800/600?random=7',
  'https://picsum.photos/800/600?random=8',
  'https://picsum.photos/800/600?random=9',
  'https://picsum.photos/800/600?random=10',
  'https://picsum.photos/800/600?random=11',
  'https://picsum.photos/800/600?random=12',
  'https://picsum.photos/800/600?random=13',
  'https://picsum.photos/800/600?random=14',
  'https://picsum.photos/800/600?random=15',
  'https://picsum.photos/800/600?random=16',
  'https://picsum.photos/800/600?random=17',
  'https://picsum.photos/800/600?random=18',
  'https://picsum.photos/800/600?random=19',
  'https://picsum.photos/800/600?random=20',
  'https://picsum.photos/800/600?random=21',
  'https://picsum.photos/800/600?random=22',
  'https://picsum.photos/800/600?random=23',
  'https://picsum.photos/800/600?random=24',
  'https://picsum.photos/800/600?random=25',
  'https://picsum.photos/800/600?random=26',
  'https://picsum.photos/800/600?random=27',
  'https://picsum.photos/800/600?random=28',
  'https://picsum.photos/800/600?random=29',
  'https://picsum.photos/800/600?random=30',
  'https://picsum.photos/800/600?random=31',
  'https://picsum.photos/800/600?random=32',
  'https://picsum.photos/800/600?random=33'
];

// Put all photos in the main event
const neverlandGalaUrls = allPhotoUrls; // All 33 photos in one event
const pirateAdventureUrls: string[] = []; // Empty other events for now
const pixieDustUrls: string[] = [];
const lostBoysUrls: string[] = [];
const captainHookBallUrls: string[] = [];

const neverlandGalaPhotos = createPhotosFromDriveUrls(
  neverlandGalaUrls,
  [
    'Peter Pan Event Photo 1',
    'Peter Pan Event Photo 2', 
    'Peter Pan Event Photo 3',
    'Peter Pan Event Photo 4',
    'Peter Pan Event Photo 5',
    'Peter Pan Event Photo 6',
    'Peter Pan Event Photo 7',
    'Peter Pan Event Photo 8',
    'Peter Pan Event Photo 9',
    'Peter Pan Event Photo 10',
    'Peter Pan Event Photo 11',
    'Peter Pan Event Photo 12',
    'Peter Pan Event Photo 13',
    'Peter Pan Event Photo 14',
    'Peter Pan Event Photo 15',
    'Peter Pan Event Photo 16',
    'Peter Pan Event Photo 17',
    'Peter Pan Event Photo 18',
    'Peter Pan Event Photo 19',
    'Peter Pan Event Photo 20',
    'Peter Pan Event Photo 21',
    'Peter Pan Event Photo 22',
    'Peter Pan Event Photo 23',
    'Peter Pan Event Photo 24',
    'Peter Pan Event Photo 25',
    'Peter Pan Event Photo 26',
    'Peter Pan Event Photo 27',
    'Peter Pan Event Photo 28',
    'Peter Pan Event Photo 29',
    'Peter Pan Event Photo 30',
    'Peter Pan Event Photo 31',
    'Peter Pan Event Photo 32',
    'Peter Pan Event Photo 33'
  ],
  800,
  600
);

const pirateAdventurePhotos = createPhotosFromDriveUrls(
  pirateAdventureUrls,
  [],
  800,
  600
);

const pixieDustPhotos = createPhotosFromDriveUrls(
  pixieDustUrls,
  [],
  800,
  600
);

const lostBoysPhotos = createPhotosFromDriveUrls(
  lostBoysUrls,
  [],
  800,
  600
);

const captainHookBallPhotos = createPhotosFromDriveUrls(
  captainHookBallUrls,
  [],
  800,
  600
);

export const galleryData: Year[] = [
  {
    year: 2023,
    events: [
      {
        slug: 'neverland-gala',
        title: 'Neverland Gala',
        description: 'An enchanting evening celebrating the magic of Neverland with costume contests and live performances.',
        date: '2023-06-15',
        year: 2023,
        coverImage: {
          src: convertDriveUrl('https://drive.google.com/file/d/1UMCny6IEvl-FhNLw7P1dW9PV0NVXDlRv/view?usp=drive_link'),
          alt: 'Neverland Gala cover image',
          width: 800,
          height: 600,
        },
        photos: neverlandGalaPhotos,
      },
      {
        slug: 'pirate-ship-adventure',
        title: 'Pirate Ship Adventure',
        description: 'Ahoy mateys! Join Captain Hook and his crew for a thrilling pirate adventure on the high seas.',
        date: '2023-09-22',
        year: 2023,
        coverImage: {
          src: convertDriveUrl('https://drive.google.com/file/d/1U_cSQqd4ScACjhrxpg9Slf4rwG4XSnug/view?usp=drive_link'),
          alt: 'Pirate Ship Adventure cover',
          width: 800,
          height: 600,
        },
        photos: pirateAdventurePhotos,
      },
    ],
  },
  {
    year: 2024,
    events: [
      {
        slug: 'pixie-dust-festival',
        title: 'Pixie Dust Festival',
        description: 'Sprinkle some magic into your day! A whimsical celebration of all things fairy and magical.',
        date: '2024-05-18',
        year: 2024,
        coverImage: {
          src: convertDriveUrl('https://drive.google.com/file/d/1UynwR-aZNmwSWvyRUD1-xDXI_3Apw14z/view?usp=drive_link'),
          alt: 'Pixie Dust Festival cover',
          width: 800,
          height: 600,
        },
        photos: pixieDustPhotos,
      },
      {
        slug: 'lost-boys-campout',
        title: 'Lost Boys Campout',
        description: 'Join Peter Pan and the Lost Boys for an unforgettable camping adventure under the Neverland stars.',
        date: '2024-08-10',
        year: 2024,
        coverImage: {
          src: convertDriveUrl('https://drive.google.com/file/d/1VLimnTWx0v-xjOvmnZUO_BUjmuGLwjSL/view?usp=drive_link'),
          alt: 'Lost Boys Campout cover',
          width: 800,
          height: 600,
        },
        photos: lostBoysPhotos,
      },
    ],
  },
  {
    year: 2025,
    events: [
      {
        slug: 'captain-hook-ball',
        title: 'Captain Hook\'s Grand Ball',
        description: 'An elegant masquerade ball hosted by Captain Hook himself. Dress to impress, mateys!',
        date: '2025-03-15',
        year: 2025,
        coverImage: {
          src: convertDriveUrl('https://drive.google.com/file/d/1VjfzKmRisJ_rrPMA8zIMt9tCVW-kHoaf/view?usp=drive_link'),
          alt: 'Captain Hook Ball cover',
          width: 800,
          height: 600,
        },
        photos: captainHookBallPhotos,
      },
      {
        slug: 'biking-bbq-poker-november-16',
        title: 'אופניים, על האש ופוקר',
        description: 'יום מלא בפעילויות - טיול אופניים, ברביקיו טעים ומשחק פוקר מהנה עם החבר\'ה.',
        date: '2025-11-16',
        year: 2025,
        coverImage: {
          src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0004.jpg',
          alt: 'פיטר פן - אופניים, על האש ופוקר',
          width: 800,
          height: 600,
        },
        photos: [
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0004.jpg', alt: 'אופניים ופוקר 1', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0005.jpg', alt: 'אופניים ופוקר 2', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0007.jpg', alt: 'אופניים ופוקר 3', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0008.jpg', alt: 'אופניים ופוקר 4', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0009.jpg', alt: 'אופניים ופוקר 5', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0010.jpg', alt: 'אופניים ופוקר 6', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0011.jpg', alt: 'אופניים ופוקר 7', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0012.jpg', alt: 'אופניים ופוקר 8', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0013.jpg', alt: 'אופניים ופוקר 9', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0014.jpg', alt: 'אופניים ופוקר 10', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0015.jpg', alt: 'אופניים ופוקר 11', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0016.jpg', alt: 'אופניים ופוקר 12', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0017.jpg', alt: 'אופניים ופוקר 13', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0018.jpg', alt: 'אופניים ופוקר 14', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0019.jpg', alt: 'אופניים ופוקר 15', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0020.jpg', alt: 'אופניים ופוקר 16', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0021.jpg', alt: 'אופניים ופוקר 17', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0022.jpg', alt: 'אופניים ופוקר 18', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0023.jpg', alt: 'אופניים ופוקר 19', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0024.jpg', alt: 'אופניים ופוקר 20', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0025.jpg', alt: 'אופניים ופוקר 21', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0026.jpg', alt: 'אופניים ופוקר 22', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0027.jpg', alt: 'אופניים ופוקר 23', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0028.jpg', alt: 'אופניים ופוקר 24', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0029.jpg', alt: 'אופניים ופוקר 25', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0030.jpg', alt: 'אופניים ופוקר 26', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0031.jpg', alt: 'אופניים ופוקר 27', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0032.jpg', alt: 'אופניים ופוקר 28', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0033.jpg', alt: 'אופניים ופוקר 29', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0034.jpg', alt: 'אופניים ופוקר 30', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0035.jpg', alt: 'אופניים ופוקר 31', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0036.jpg', alt: 'אופניים ופוקר 32', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0037.jpg', alt: 'אופניים ופוקר 33', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0038.jpg', alt: 'אופניים ופוקר 34', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0039.jpg', alt: 'אופניים ופוקר 35', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0047.jpg', alt: 'אופניים ופוקר 36', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0051.jpg', alt: 'אופניים ופוקר 37', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0052.jpg', alt: 'אופניים ופוקר 38', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0053.jpg', alt: 'אופניים ופוקר 39', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0054.jpg', alt: 'אופניים ופוקר 40', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0055.jpg', alt: 'אופניים ופוקר 41', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0056.jpg', alt: 'אופניים ופוקר 42', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0057.jpg', alt: 'אופניים ופוקר 43', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0058.jpg', alt: 'אופניים ופוקר 44', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0059.jpg', alt: 'אופניים ופוקר 45', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0060.jpg', alt: 'אופניים ופוקר 46', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0061.jpg', alt: 'אופניים ופוקר 47', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0062.jpg', alt: 'אופניים ופוקר 48', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0063.jpg', alt: 'אופניים ופוקר 49', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0064.jpg', alt: 'אופניים ופוקר 50', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0065.jpg', alt: 'אופניים ופוקר 51', width: 800, height: 600 },
          { src: '/images/2025/אופניים, על האש, פוקר - נובמבר 2025/IMG-20251116-WA0066.jpg', alt: 'אופניים ופוקר 52', width: 800, height: 600 },
        ],
        videosUrl: 'https://drive.google.com/drive/folders/14u2MHcTobMddsO2zEJHFXVyFtk1SlF6W?usp=sharing',
      },
    ],
  },
  {
    year: 2026,
    events: [
      {
        slug: 'pool-party-june-2026',
        title: 'חפלה בבריכה',
        description: 'מסיבת בריכה קיצית מהנה - יום שטוף שמש של כיף במים יחד עם כל החבר\'ה.',
        date: '2026-06-14',
        year: 2026,
        coverImage: {
          src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0053.jpg',
          alt: 'חפלה בבריכה - יוני 2026',
          width: 800,
          height: 600,
        },
        photos: [
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0053.jpg', alt: 'חפלה בבריכה 1', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0064.jpg', alt: 'חפלה בבריכה 2', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0065.jpg', alt: 'חפלה בבריכה 3', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0066.jpg', alt: 'חפלה בבריכה 4', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0067.jpg', alt: 'חפלה בבריכה 5', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0068.jpg', alt: 'חפלה בבריכה 6', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0069.jpg', alt: 'חפלה בבריכה 7', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0070.jpg', alt: 'חפלה בבריכה 8', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0072.jpg', alt: 'חפלה בבריכה 9', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0073.jpg', alt: 'חפלה בבריכה 10', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0074.jpg', alt: 'חפלה בבריכה 11', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0076.jpg', alt: 'חפלה בבריכה 12', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0077.jpg', alt: 'חפלה בבריכה 13', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0078.jpg', alt: 'חפלה בבריכה 14', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0081.jpg', alt: 'חפלה בבריכה 15', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0082.jpg', alt: 'חפלה בבריכה 16', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0084.jpg', alt: 'חפלה בבריכה 17', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260614-WA0085.jpg', alt: 'חפלה בבריכה 18', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0000.jpg', alt: 'חפלה בבריכה 19', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0002.jpg', alt: 'חפלה בבריכה 20', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0003.jpg', alt: 'חפלה בבריכה 21', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0004.jpg', alt: 'חפלה בבריכה 22', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0005.jpg', alt: 'חפלה בבריכה 23', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0006.jpg', alt: 'חפלה בבריכה 24', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0007.jpg', alt: 'חפלה בבריכה 25', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0008.jpg', alt: 'חפלה בבריכה 26', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0009.jpg', alt: 'חפלה בבריכה 27', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0010.jpg', alt: 'חפלה בבריכה 28', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0011.jpg', alt: 'חפלה בבריכה 29', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0012.jpg', alt: 'חפלה בבריכה 30', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0015.jpg', alt: 'חפלה בבריכה 31', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0042.jpg', alt: 'חפלה בבריכה 32', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0044.jpg', alt: 'חפלה בבריכה 33', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0046.jpg', alt: 'חפלה בבריכה 34', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0048.jpg', alt: 'חפלה בבריכה 35', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0050.jpg', alt: 'חפלה בבריכה 36', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0052.jpg', alt: 'חפלה בבריכה 37', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0054.jpg', alt: 'חפלה בבריכה 38', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0056.jpg', alt: 'חפלה בבריכה 39', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0058.jpg', alt: 'חפלה בבריכה 40', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0060.jpg', alt: 'חפלה בבריכה 41', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0062.jpg', alt: 'חפלה בבריכה 42', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0064.jpg', alt: 'חפלה בבריכה 43', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0066.jpg', alt: 'חפלה בבריכה 44', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0068.jpg', alt: 'חפלה בבריכה 45', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0070.jpg', alt: 'חפלה בבריכה 46', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0072.jpg', alt: 'חפלה בבריכה 47', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0074.jpg', alt: 'חפלה בבריכה 48', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0076.jpg', alt: 'חפלה בבריכה 49', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0078.jpg', alt: 'חפלה בבריכה 50', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0080.jpg', alt: 'חפלה בבריכה 51', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0082.jpg', alt: 'חפלה בבריכה 52', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0084.jpg', alt: 'חפלה בבריכה 53', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0086.jpg', alt: 'חפלה בבריכה 54', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0093.jpg', alt: 'חפלה בבריכה 55', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0103.jpg', alt: 'חפלה בבריכה 56', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0105.jpg', alt: 'חפלה בבריכה 57', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0107.jpg', alt: 'חפלה בבריכה 58', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0109.jpg', alt: 'חפלה בבריכה 59', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0111.jpg', alt: 'חפלה בבריכה 60', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0113.jpg', alt: 'חפלה בבריכה 61', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0115.jpg', alt: 'חפלה בבריכה 62', width: 800, height: 600 },
          { src: '/images/2026/חפלה בבריכה - יוני 2026/IMG-20260615-WA0117.jpg', alt: 'חפלה בבריכה 63', width: 800, height: 600 },
        ],
      },
    ],
  },
];

export const getYears = (): number[] => {
  return galleryData.map(y => y.year).sort((a, b) => b - a);
};

export const getYearData = (year: number): Year | undefined => {
  return galleryData.find(y => y.year === year);
};

export const getEvent = (year: number, slug: string): Event | undefined => {
  const yearData = getYearData(year);
  return yearData?.events.find(e => e.slug === slug);
};

export const getFeaturedEvents = (limit: number = 3): Event[] => {
  const allEvents = galleryData.flatMap(y => y.events);
  return allEvents.slice(0, limit);
};