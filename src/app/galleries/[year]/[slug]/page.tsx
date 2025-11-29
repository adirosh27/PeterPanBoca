import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEvent, galleryData } from '@/lib/data';
import Gallery from '@/components/Gallery';

interface EventPageProps {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const params: { year: string; slug: string }[] = [];
  
  galleryData.forEach((yearData) => {
    yearData.events.forEach((event) => {
      params.push({
        year: yearData.year.toString(),
        slug: event.slug,
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { year: yearString, slug } = await params;
  const year = parseInt(yearString);
  const event = getEvent(year, slug);
  
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: event.title,
    description: `${event.description} View ${event.photos.length} photos from this magical Peter Pan event in ${year}.`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [
        {
          url: event.coverImage.src,
          width: event.coverImage.width,
          height: event.coverImage.height,
          alt: event.coverImage.alt,
        },
      ],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { year: yearString, slug } = await params;
  const year = parseInt(yearString);
  const event = getEvent(year, slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/galleries" className="hover:text-primary-600 transition-colors">
            Galleries
          </Link>
          <span>/</span>
          <Link href={`/galleries/${year}`} className="hover:text-primary-600 transition-colors">
            {year}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{event.title}</span>
        </div>
      </nav>

      {/* Event Header */}
      <div className="mb-12">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={event.coverImage.src}
            alt={event.coverImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {event.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <p className="text-lg text-gray-200">
                {new Date(event.date).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="hidden md:block text-gray-400">•</div>
              <p className="text-lg text-gray-200">
                {event.photos.length} {event.photos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <p className="text-lg text-gray-700 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="mb-12">
        <Gallery photos={event.photos} />
      </div>

      {/* Videos Section */}
      {event.videosUrl && (
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6">
            סרטונים
          </h2>
          <div className="card p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <svg className="w-16 h-16 mx-auto mb-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                צפייה בסרטונים מהאירוע
              </h3>
              <p className="text-gray-600 mb-6">
                לחצו על הכפתור למטה לצפייה בכל הסרטונים מהאירוע ב-Google Drive
              </p>
              <a
                href={event.videosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                פתיחת הסרטונים
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t">
        <Link 
          href={`/galleries/${year}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {year} Events
        </Link>
        
        <Link 
          href="/galleries"
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          All Galleries
        </Link>
      </div>
    </div>
  );
}