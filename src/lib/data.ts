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