import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedEvents, getYears } from '@/lib/data';
import ThemedContent from '@/components/ThemedContent';

export default function ThemedHomePage() {
  const featuredEvents = getFeaturedEvents(3);
  const years = getYears();

  return (
    <ThemedContent>
      {(theme) => (
        <div className={`space-y-16 pb-16 min-h-screen ${theme.body}`}>
          {/* Hero Section */}
          <section className={`${theme.hero.background} ${theme.hero.text} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative container mx-auto px-4 py-24 text-center">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-6xl mb-4">
                  {theme === themes['skull-rock-shores'] && '🏴‍☠️⚓💀'}
                  {theme === themes['pixie-dust-pastels'] && '🧚‍♀️✨🌟'}
                  {theme === themes['lost-boys-scrapbook'] && '🌳🏹📖'}
                  {theme === themes['captain-hooks-log'] && '⚓🚢👑'}
                  {theme === themes['neverland-night'] && '🌙⭐✨'}
                </div>
                <h1 className={`text-5xl md:text-6xl ${theme.font} font-bold leading-tight`}>
                  {theme === themes['skull-rock-shores'] && 'Ahoy, Mateys!'}
                  {theme === themes['pixie-dust-pastels'] && 'Welcome to Fairyland'}
                  {theme === themes['lost-boys-scrapbook'] && 'Adventure Awaits!'}
                  {theme === themes['captain-hooks-log'] && 'The Captain\'s Chronicles'}
                  {theme === themes['neverland-night'] && 'Welcome to Neverland'}
                </h1>
                <p className={`text-xl md:text-2xl ${theme.hero.accent} max-w-2xl mx-auto`}>
                  {theme === themes['skull-rock-shores'] && 'Join our swashbuckling photo adventures across the seven seas of Boca Raton'}
                  {theme === themes['pixie-dust-pastels'] && 'Discover magical moments captured in our enchanting fairy tale galleries'}
                  {theme === themes['lost-boys-scrapbook'] && 'Explore our handcrafted collection of wilderness memories and fun'}
                  {theme === themes['captain-hooks-log'] && 'Sail through our elegant collection of sophisticated maritime memories'}
                  {theme === themes['neverland-night'] && 'Capturing magical moments from our enchanting Peter Pan events in Boca Raton'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Link href="/galleries" className={`${theme.button.primary} px-8 py-4 rounded-lg transition-all duration-200 text-lg font-semibold`}>
                    {theme === themes['skull-rock-shores'] && '🏴‍☠️ Explore Treasures'}
                    {theme === themes['pixie-dust-pastels'] && '✨ View Magic'}
                    {theme === themes['lost-boys-scrapbook'] && '📖 Browse Adventures'}
                    {theme === themes['captain-hooks-log'] && '⚓ View Chronicles'}
                    {theme === themes['neverland-night'] && '🌟 Explore Galleries'}
                  </Link>
                  <Link href="/about" className={`${theme.button.secondary} px-8 py-4 rounded-lg transition-all duration-200 text-lg`}>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Events */}
          <section className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className={`text-4xl ${theme.font} font-bold mb-4`}>
                {theme === themes['skull-rock-shores'] && '🏴‍☠️ Legendary Adventures'}
                {theme === themes['pixie-dust-pastels'] && '✨ Magical Moments'}
                {theme === themes['lost-boys-scrapbook'] && '📖 Memory Book'}
                {theme === themes['captain-hooks-log'] && '⚓ Ship\'s Log'}
                {theme === themes['neverland-night'] && '🌟 Featured Events'}
              </h2>
              <p className="text-lg max-w-2xl mx-auto">
                {theme === themes['skull-rock-shores'] && 'Dive into our most swashbuckling adventures from recent pirate expeditions'}
                {theme === themes['pixie-dust-pastels'] && 'Step into our most enchanting fairy tale moments and magical memories'}
                {theme === themes['lost-boys-scrapbook'] && 'Flip through pages of our wildest adventures and fun-filled memories'}
                {theme === themes['captain-hooks-log'] && 'Peruse our most distinguished maritime events and elegant gatherings'}
                {theme === themes['neverland-night'] && 'Dive into our most magical moments from recent Peter Pan adventures'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Link 
                  key={`${event.year}-${event.slug}`}
                  href={`/galleries/${event.year}/${event.slug}`}
                  className={`${theme.card.background} ${theme.card.border} ${theme.card.shadow} group overflow-hidden transition-all duration-300 hover:scale-105`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={event.coverImage.src}
                      alt={event.coverImage.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className={`text-xl ${theme.font} font-semibold mb-1`}>
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
                    <p className={`${theme.card.text}`}>
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Years Overview */}
          <section className={`${theme.card.background} py-16`}>
            <div className="container mx-auto px-4 text-center">
              <h2 className={`text-4xl ${theme.font} font-bold ${theme.card.text} mb-4`}>
                {theme === themes['skull-rock-shores'] && '🗓️ Voyage Timeline'}
                {theme === themes['pixie-dust-pastels'] && '📅 Magical Years'}
                {theme === themes['lost-boys-scrapbook'] && '📆 Adventure Years'}
                {theme === themes['captain-hooks-log'] && '⏰ Maritime Archives'}
                {theme === themes['neverland-night'] && '🗓️ Explore by Year'}
              </h2>
              <p className={`text-lg ${theme.card.text} mb-12 max-w-2xl mx-auto`}>
                Journey through years of magical memories
              </p>
              
              <div className="flex justify-center gap-6 flex-wrap">
                {years.map((year) => (
                  <Link 
                    key={year}
                    href={`/galleries/${year}`}
                    className={`${theme.button.primary} py-6 px-10 rounded-xl transition-all duration-300 text-2xl font-bold hover:scale-110 hover:shadow-2xl ${theme.card.shadow}`}
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="container mx-auto px-4 text-center">
            <div className={`${theme.card.background} ${theme.card.border} ${theme.card.shadow} rounded-2xl p-12`}>
              <div className="text-4xl mb-6">
                {theme === themes['skull-rock-shores'] && '💎'}
                {theme === themes['pixie-dust-pastels'] && '🌟'}
                {theme === themes['lost-boys-scrapbook'] && '🗺️'}
                {theme === themes['captain-hooks-log'] && '🏆'}
                {theme === themes['neverland-night'] && '✨'}
              </div>
              <h2 className={`text-3xl ${theme.font} font-bold ${theme.card.text} mb-4`}>
                {theme === themes['skull-rock-shores'] && 'Ready to Join Our Crew?'}
                {theme === themes['pixie-dust-pastels'] && 'Ready for Your Fairy Tale?'}
                {theme === themes['lost-boys-scrapbook'] && 'Ready for Adventure?'}
                {theme === themes['captain-hooks-log'] && 'Ready to Set Sail?'}
                {theme === themes['neverland-night'] && 'Ready for Your Own Adventure?'}
              </h2>
              <p className={`text-lg ${theme.card.text} mb-8 max-w-2xl mx-auto`}>
                Join us for upcoming Peter Pan events and create magical memories that will last a lifetime.
              </p>
              <Link href="/about" className={`${theme.button.primary} text-lg px-8 py-4 rounded-lg`}>
                {theme === themes['skull-rock-shores'] && '🏴‍☠️ Join the Crew'}
                {theme === themes['pixie-dust-pastels'] && '✨ Start Your Journey'}
                {theme === themes['lost-boys-scrapbook'] && '🌲 Join the Adventure'}
                {theme === themes['captain-hooks-log'] && '⚓ Come Aboard'}
                {theme === themes['neverland-night'] && '🌟 Get Involved'}
              </Link>
            </div>
          </section>
        </div>
      )}
    </ThemedContent>
  );
}