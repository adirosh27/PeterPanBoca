import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedEvents, getYears } from '@/lib/data';

export default function HomePage() {
  const featuredEvents = getFeaturedEvents(3);
  const years = getYears();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-400 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-6xl mb-4">✨🧚‍♀️⭐</div>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
              Welcome to Neverland
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Capturing magical moments from our enchanting Peter Pan events in Boca Raton
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/galleries" className="btn-primary text-lg px-8 py-4">
                Explore Galleries
              </Link>
              <Link href="/about" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-8 py-4 rounded-lg transition-all duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dive into our most magical moments from recent Peter Pan adventures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <Link 
              key={`${event.year}-${event.slug}`}
              href={`/galleries/${event.year}/${event.slug}`}
              className="card group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={event.coverImage.src}
                  alt={event.coverImage.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-display font-semibold mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  {event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Years Overview */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
            Explore by Year
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Journey through years of magical memories
          </p>
          
          <div className="flex justify-center gap-8">
            {years.map((year) => (
              <Link 
                key={year}
                href={`/galleries/${year}`}
                className="bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold py-8 px-12 rounded-lg transition-colors duration-200 text-2xl"
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-secondary-100 to-primary-100 rounded-2xl p-12">
          <div className="text-4xl mb-4">🌟</div>
          <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">
            Ready for Your Own Adventure?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us for upcoming Peter Pan events and create magical memories that will last a lifetime.
          </p>
          <Link href="/about" className="btn-primary text-lg px-8 py-4">
            Get Involved
          </Link>
        </div>
      </section>
    </div>
  );
}