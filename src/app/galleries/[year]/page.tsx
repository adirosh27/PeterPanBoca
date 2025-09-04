import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getYearData, getYears } from '@/lib/data';

interface YearPageProps {
  params: {
    year: string;
  };
}

export async function generateStaticParams() {
  const years = getYears();
  return years.map((year) => ({
    year: year.toString(),
  }));
}

export async function generateMetadata({ params }: YearPageProps) {
  const year = parseInt(params.year);
  const yearData = getYearData(year);
  
  if (!yearData) {
    return {
      title: 'Year Not Found',
    };
  }

  return {
    title: `${year} Photo Galleries`,
    description: `Browse all Peter Pan events from ${year}. ${yearData.events.length} magical events captured.`,
  };
}

export default function YearPage({ params }: YearPageProps) {
  const year = parseInt(params.year);
  const yearData = getYearData(year);

  if (!yearData) {
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
          <span className="text-gray-800 font-medium">{year}</span>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          {year} Events
        </h1>
        <p className="text-lg text-gray-600">
          {yearData.events.length} magical {yearData.events.length === 1 ? 'event' : 'events'} from {year}
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {yearData.events.map((event) => (
          <Link 
            key={event.slug}
            href={`/galleries/${year}/${event.slug}`}
            className="card group"
          >
            <div className="relative h-80 overflow-hidden">
              <Image
                src={event.coverImage.src}
                alt={event.coverImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-2xl font-display font-semibold mb-2">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-200 mb-3">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 leading-relaxed">
                {event.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 font-medium">
                  {event.photos.length} photos
                </span>
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  View Gallery
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-16 text-center">
        <Link 
          href="/galleries"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Galleries
        </Link>
      </div>
    </div>
  );
}