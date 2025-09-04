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

// Sample data - replace with real content later
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
          src: 'https://via.placeholder.com/800x600/1e40af/ffffff?text=Neverland+Gala',
          alt: 'Neverland Gala cover image',
          width: 800,
          height: 600,
        },
        photos: [
          {
            src: 'https://via.placeholder.com/800x600/1e40af/ffffff?text=Photo+1',
            alt: 'Guests in Peter Pan costumes',
            width: 800,
            height: 600,
            title: 'Costume Contest Winners',
          },
          {
            src: 'https://via.placeholder.com/600x800/059669/ffffff?text=Photo+2',
            alt: 'Tinker Bell performance',
            width: 600,
            height: 800,
            title: 'Tinker Bell Flying Show',
          },
          {
            src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Photo+3',
            alt: 'Captain Hook villain performance',
            width: 800,
            height: 600,
            title: 'Captain Hook Arrives',
          },
          {
            src: 'https://via.placeholder.com/600x600/7c3aed/ffffff?text=Photo+4',
            alt: 'Children learning to fly',
            width: 600,
            height: 600,
            title: 'Flying Lessons',
          },
          {
            src: 'https://via.placeholder.com/800x600/ea580c/ffffff?text=Photo+5',
            alt: 'Neverland feast table',
            width: 800,
            height: 600,
            title: 'The Great Feast',
          },
          {
            src: 'https://via.placeholder.com/600x800/0891b2/ffffff?text=Photo+6',
            alt: 'Pirate ship decoration',
            width: 600,
            height: 800,
            title: 'Jolly Roger Setup',
          },
        ],
      },
      {
        slug: 'pirate-ship-adventure',
        title: 'Pirate Ship Adventure',
        description: 'Ahoy mateys! Join Captain Hook and his crew for a thrilling pirate adventure on the high seas.',
        date: '2023-09-22',
        year: 2023,
        coverImage: {
          src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Pirate+Adventure',
          alt: 'Pirate Ship Adventure cover',
          width: 800,
          height: 600,
        },
        photos: [
          {
            src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Ship+1',
            alt: 'The magnificent pirate ship',
            width: 800,
            height: 600,
            title: 'All Aboard the Jolly Roger',
          },
          {
            src: 'https://via.placeholder.com/600x800/0891b2/ffffff?text=Ship+2',
            alt: 'Captain Hook at the helm',
            width: 600,
            height: 800,
            title: 'Captain Hook Takes Command',
          },
          {
            src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Ship+3',
            alt: 'Treasure hunt in progress',
            width: 800,
            height: 600,
            title: 'X Marks the Spot',
          },
          {
            src: 'https://via.placeholder.com/600x600/ea580c/ffffff?text=Ship+4',
            alt: 'Pirates sharing treasure',
            width: 600,
            height: 600,
            title: 'Sharing the Bounty',
          },
          {
            src: 'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Ship+5',
            alt: 'Walking the plank game',
            width: 800,
            height: 600,
            title: 'Walk the Plank Challenge',
          },
          {
            src: 'https://via.placeholder.com/600x800/1e40af/ffffff?text=Ship+6',
            alt: 'Sunset over the ship',
            width: 600,
            height: 800,
            title: 'Sunset Sail Home',
          },
        ],
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
          src: 'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Pixie+Dust+Festival',
          alt: 'Pixie Dust Festival cover',
          width: 800,
          height: 600,
        },
        photos: [
          {
            src: 'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Pixie+1',
            alt: 'Fairy garden entrance',
            width: 800,
            height: 600,
            title: 'Welcome to Fairy Garden',
          },
          {
            src: 'https://via.placeholder.com/600x800/ec4899/ffffff?text=Pixie+2',
            alt: 'Children with fairy wings',
            width: 600,
            height: 800,
            title: 'Little Fairies at Play',
          },
          {
            src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Pixie+3',
            alt: 'Tinker Bell meet and greet',
            width: 800,
            height: 600,
            title: 'Meeting Tinker Bell',
          },
          {
            src: 'https://via.placeholder.com/600x600/ea580c/ffffff?text=Pixie+4',
            alt: 'Fairy house building',
            width: 600,
            height: 600,
            title: 'Building Fairy Houses',
          },
          {
            src: 'https://via.placeholder.com/800x600/0891b2/ffffff?text=Pixie+5',
            alt: 'Magic wand crafting',
            width: 800,
            height: 600,
            title: 'Crafting Magic Wands',
          },
          {
            src: 'https://via.placeholder.com/600x800/dc2626/ffffff?text=Pixie+6',
            alt: 'Fairy dust ceremony',
            width: 600,
            height: 800,
            title: 'The Great Dusting',
          },
        ],
      },
      {
        slug: 'lost-boys-campout',
        title: 'Lost Boys Campout',
        description: 'Join Peter Pan and the Lost Boys for an unforgettable camping adventure under the Neverland stars.',
        date: '2024-08-10',
        year: 2024,
        coverImage: {
          src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Lost+Boys+Campout',
          alt: 'Lost Boys Campout cover',
          width: 800,
          height: 600,
        },
        photos: [
          {
            src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Camp+1',
            alt: 'Campfire with Lost Boys',
            width: 800,
            height: 600,
            title: 'Campfire Stories',
          },
          {
            src: 'https://via.placeholder.com/600x800/ea580c/ffffff?text=Camp+2',
            alt: 'Tree house adventure',
            width: 600,
            height: 800,
            title: 'Tree House Hideout',
          },
          {
            src: 'https://via.placeholder.com/800x600/1e40af/ffffff?text=Camp+3',
            alt: 'Peter Pan teaching to fly',
            width: 800,
            height: 600,
            title: 'Flying Lessons with Peter',
          },
          {
            src: 'https://via.placeholder.com/600x600/7c3aed/ffffff?text=Camp+4',
            alt: 'Lost Boys games',
            width: 600,
            height: 600,
            title: 'Lost Boys Games',
          },
          {
            src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Camp+5',
            alt: 'Stargazing in Neverland',
            width: 800,
            height: 600,
            title: 'Neverland Night Sky',
          },
          {
            src: 'https://via.placeholder.com/600x800/ec4899/ffffff?text=Camp+6',
            alt: 'Morning in the forest',
            width: 600,
            height: 800,
            title: 'Forest Morning',
          },
        ],
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
          src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Captain+Hook+Ball',
          alt: 'Captain Hook Ball cover',
          width: 800,
          height: 600,
        },
        photos: [
          {
            src: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Ball+1',
            alt: 'Grand ballroom setup',
            width: 800,
            height: 600,
            title: 'The Grand Ballroom',
          },
          {
            src: 'https://via.placeholder.com/600x800/0891b2/ffffff?text=Ball+2',
            alt: 'Captain Hook welcoming guests',
            width: 600,
            height: 800,
            title: 'Captain Hook\'s Welcome',
          },
          {
            src: 'https://via.placeholder.com/800x600/ea580c/ffffff?text=Ball+3',
            alt: 'Elegant masquerade masks',
            width: 800,
            height: 600,
            title: 'Masquerade Elegance',
          },
          {
            src: 'https://via.placeholder.com/600x600/7c3aed/ffffff?text=Ball+4',
            alt: 'Dancing couples',
            width: 600,
            height: 600,
            title: 'Ballroom Dancing',
          },
          {
            src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Ball+5',
            alt: 'Pirate orchestra',
            width: 800,
            height: 600,
            title: 'The Pirate Orchestra',
          },
          {
            src: 'https://via.placeholder.com/600x800/ec4899/ffffff?text=Ball+6',
            alt: 'Midnight fireworks',
            width: 600,
            height: 800,
            title: 'Midnight Spectacular',
          },
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