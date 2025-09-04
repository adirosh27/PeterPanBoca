import Link from 'next/link';
import { galleryData } from '@/lib/data';

export const metadata = {
  title: 'Photo Galleries',
  description: 'Browse all our Peter Pan event photo galleries organized by year.',
};

export default function GalleriesPage() {
  // Sort years in descending order (newest first)
  const sortedData = [...galleryData].sort((a, b) => b.year - a.year);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Photo Galleries
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our magical collection of Peter Pan events, organized by year
        </p>
      </div>

      <div className="space-y-16">
        {sortedData.map((yearData) => (
          <section key={yearData.year} className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-primary-800 mb-2">
                {yearData.year}
              </h2>
              <div className="w-24 h-1 bg-accent-400 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yearData.events.map((event) => (
                <Link 
                  key={event.slug}
                  href={`/galleries/${yearData.year}/${event.slug}`}
                  className="card group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.coverImage.src}
                      alt={event.coverImage.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-display font-semibold mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-primary-600">
                      <span>{event.photos.length} photos</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}