'use client';

import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [themeContent, setThemeContent] = useState({
    title: '⚓ About Our Maritime Adventures',
    subtitle: 'Learn about Captain Hook\'s distinguished photo gallery experiences in Boca Raton',
    storyTitle: 'Our Nautical Journey',
    missionTitle: 'Our Maritime Mission',
    eventsTitle: 'Types of Expeditions',
    ctaTitle: 'Ready to Set Sail?',
    ctaButton: '⚓ Join the Crew'
  });

  useEffect(() => {
    const updateContent = () => {
      const currentTheme = (window as any).currentTheme || 'captain-hooks-log';
      
      const themeTexts = {
        'neverland-night': {
          title: '🌟 About Neverland',
          subtitle: 'Learn about our magical photo gallery experiences in Boca Raton',
          storyTitle: 'Our Magical Story',
          missionTitle: 'Our Enchanted Mission',
          eventsTitle: 'Types of Adventures',
          ctaTitle: 'Ready for Your Own Adventure?',
          ctaButton: '🌟 Get Involved'
        },
        'skull-rock-shores': {
          title: '🏴‍☠️ About Our Pirate Crew',
          subtitle: 'Learn about our swashbuckling photo adventures in Boca Raton',
          storyTitle: 'Our Pirate Legend',
          missionTitle: 'Our Treasure Hunt Mission',
          eventsTitle: 'Types of Adventures',
          ctaTitle: 'Ready to Join Our Crew?',
          ctaButton: '🏴‍☠️ Join the Crew'
        },
        'pixie-dust-pastels': {
          title: '✨ About Our Fairy Kingdom',
          subtitle: 'Learn about our magical fairy tale experiences in Boca Raton',
          storyTitle: 'Our Fairy Tale',
          missionTitle: 'Our Magical Mission',
          eventsTitle: 'Types of Magic',
          ctaTitle: 'Ready for Your Fairy Tale?',
          ctaButton: '✨ Start Your Journey'
        },
        'lost-boys-scrapbook': {
          title: '📖 About Our Adventure Club',
          subtitle: 'Learn about our handcrafted wilderness experiences in Boca Raton',
          storyTitle: 'Our Adventure Story',
          missionTitle: 'Our Wild Mission',
          eventsTitle: 'Types of Adventures',
          ctaTitle: 'Ready for Adventure?',
          ctaButton: '🌲 Join the Adventure'
        },
        'captain-hooks-log': {
          title: '⚓ About Our Maritime Adventures',
          subtitle: 'Learn about Captain Hook\'s distinguished photo gallery experiences in Boca Raton',
          storyTitle: 'Our Nautical Journey',
          missionTitle: 'Our Maritime Mission',
          eventsTitle: 'Types of Expeditions',
          ctaTitle: 'Ready to Set Sail?',
          ctaButton: '⚓ Join the Crew'
        }
      };

      setThemeContent(themeTexts[currentTheme as keyof typeof themeTexts] || themeTexts['captain-hooks-log']);
    };

    updateContent();
    window.addEventListener('theme-change', updateContent);
    return () => window.removeEventListener('theme-change', updateContent);
  }, []);

  return (
    <div style={{ padding: '3rem 2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>⚓🚢👑</div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem' 
          }}>
            {themeContent.title}
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            {themeContent.subtitle}
          </p>
        </div>

        {/* Story Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem', 
          marginBottom: '4rem' 
        }}>
          <div 
            data-card
            style={{
              padding: '2rem',
              borderRadius: '15px'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {themeContent.storyTitle}
            </h2>
            <div style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Since 2023, Peter Pan Boca has been bringing the enchanting world of Neverland to families in Boca Raton. What started as a small community gathering has grown into a beloved series of magical events that capture the wonder and imagination of J.M. Barrie's timeless tale.
              </p>
              <p>
                Our events feature elaborate themed decorations, interactive storytelling, costume contests, and plenty of opportunities for photos that families will treasure forever. From elegant maritime galas to swashbuckling pirate adventures, each event is carefully crafted to transport guests into the magical world of Peter Pan.
              </p>
            </div>
          </div>
          
          <div 
            data-card
            style={{
              padding: '2rem',
              borderRadius: '15px'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {themeContent.missionTitle}
            </h2>
            <div style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                We create distinguished experiences that celebrate imagination, family bonds, and the elegance of storytelling. Every Peter Pan Boca event is designed to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '0.5rem' }}>Foster creativity and imagination in children and adults alike</li>
                <li style={{ marginBottom: '0.5rem' }}>Bring families together through shared sophisticated experiences</li>
                <li style={{ marginBottom: '0.5rem' }}>Create lasting memories captured in beautiful photographs</li>
                <li>Build community connections through the power of storytelling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div 
          data-card
          style={{
            padding: '3rem',
            borderRadius: '20px',
            marginBottom: '4rem',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            {themeContent.eventsTitle}
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚓</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Maritime Galas</h3>
              <p style={{ lineHeight: '1.6' }}>Elegant evening events with sophisticated nautical decorations and distinguished moments</p>
            </div>
            
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏴‍☠️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pirate Adventures</h3>
              <p style={{ lineHeight: '1.6' }}>Swashbuckling fun with treasure hunts and pirate ship photo opportunities</p>
            </div>
            
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧚‍♀️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pixie Dust Festivals</h3>
              <p style={{ lineHeight: '1.6' }}>Whimsical celebrations focused on fairy magic and children's activities</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            {themeContent.ctaTitle}
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Follow us on social media to stay updated on upcoming events and be the first to see new photo galleries from our magical adventures.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              data-button
              style={{
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {themeContent.ctaButton}
            </button>
            <button
              style={{
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: '2px solid currentColor',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Follow on Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}