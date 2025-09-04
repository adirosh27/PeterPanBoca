export const metadata = {
  title: 'About Us',
  description: 'Learn about Peter Pan Boca and our magical photo gallery experiences in Boca Raton.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">✨🧚‍♀️⭐</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6">
            About Peter Pan Boca
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe in the magic of childhood and the power of imagination. Our Peter Pan events in Boca Raton create unforgettable experiences where families can escape to Neverland together.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary-800 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Since 2023, Peter Pan Boca has been bringing the enchanting world of Neverland to families in Boca Raton. What started as a small community gathering has grown into a beloved series of magical events that capture the wonder and imagination of J.M. Barrie's timeless tale.
              </p>
              <p>
                Our events feature elaborate themed decorations, interactive storytelling, costume contests, and plenty of opportunities for photos that families will treasure forever. From elegant Neverland galas to swashbuckling pirate adventures, each event is carefully crafted to transport guests into the magical world of Peter Pan.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold text-primary-800 mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We create magical experiences that celebrate imagination, family bonds, and the joy of childhood. Every Peter Pan Boca event is designed to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">•</span>
                  Foster creativity and imagination in children and adults alike
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">•</span>
                  Bring families together through shared magical experiences
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">•</span>
                  Create lasting memories captured in beautiful photographs
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">•</span>
                  Build community connections through the power of storytelling
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-center text-gray-800 mb-8">
            Types of Events
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Neverland Galas</h3>
              <p className="text-gray-600">Elegant evening events with fairy-tale decorations and magical moments</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🏴‍☠️</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Pirate Adventures</h3>
              <p className="text-gray-600">Swashbuckling fun with treasure hunts and pirate ship photo ops</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🧚‍♀️</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Pixie Dust Festivals</h3>
              <p className="text-gray-600">Whimsical celebrations focused on fairy magic and children's activities</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-800 mb-6">
            Ready to Fly to Neverland?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media to stay updated on upcoming events and be the first to see new photo galleries from our magical adventures.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary">
              Follow on Instagram
            </button>
            <button className="bg-secondary-100 hover:bg-secondary-200 text-secondary-800 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
              Join Our Mailing List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}