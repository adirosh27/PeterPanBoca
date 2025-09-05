'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedEvents, getYears } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [themeContent, setThemeContent] = useState({
    heroTitle: "ברוכים הבאים לקבוצת פיטר פן בבוקה רטון",
    heroSubtitle: '', 
    heroIcons: '⚓🚢👑',
    sectionTitle: '⚓ Ship\'s Log',
    sectionSubtitle: 'Peruse our most distinguished maritime events and elegant gatherings',
    buttonText: '⚓ View Chronicles',
    ctaTitle: 'Ready to Set Sail?',
    ctaButton: '⚓ Come Aboard',
    yearTitle: '⏰ Maritime Archives'
  });

  useEffect(() => {
    const updateContent = () => {
      const currentTheme = (window as any).currentTheme || 'captain-hooks-log';
      
      const themeTexts = {
        'neverland-night': {
          heroTitle: 'Welcome to Neverland',
          heroSubtitle: 'Capturing magical moments from our enchanting Peter Pan events in Boca Raton',
          heroIcons: '🌙⭐✨',
          sectionTitle: '🌟 Featured Events', 
          sectionSubtitle: 'Dive into our most magical moments from recent Peter Pan adventures',
          buttonText: '🌟 Explore Galleries',
          ctaTitle: 'Ready for Your Own Adventure?',
          ctaButton: '🌟 Get Involved',
          yearTitle: '🗓️ Explore by Year'
        },
        'skull-rock-shores': {
          heroTitle: 'Ahoy, Mateys!',
          heroSubtitle: 'Join our swashbuckling photo adventures across the seven seas of Boca Raton',
          heroIcons: '🏴‍☠️⚓💀',
          sectionTitle: '🏴‍☠️ Legendary Adventures',
          sectionSubtitle: 'Dive into our most swashbuckling adventures from recent pirate expeditions',
          buttonText: '🏴‍☠️ Explore Treasures',
          ctaTitle: 'Ready to Join Our Crew?',
          ctaButton: '🏴‍☠️ Join the Crew',
          yearTitle: '🗓️ Voyage Timeline'
        },
        'pixie-dust-pastels': {
          heroTitle: 'Welcome to Fairyland',
          heroSubtitle: 'Discover magical moments captured in our enchanting fairy tale galleries',
          heroIcons: '🧚‍♀️✨🌟',
          sectionTitle: '✨ Magical Moments',
          sectionSubtitle: 'Step into our most enchanting fairy tale moments and magical memories',
          buttonText: '✨ View Magic',
          ctaTitle: 'Ready for Your Fairy Tale?',
          ctaButton: '✨ Start Your Journey',
          yearTitle: '📅 Magical Years'
        },
        'lost-boys-scrapbook': {
          heroTitle: 'Adventure Awaits!',
          heroSubtitle: 'Explore our handcrafted collection of wilderness memories and fun',
          heroIcons: '🌳🏹📖',
          sectionTitle: '📖 Memory Book',
          sectionSubtitle: 'Flip through pages of our wildest adventures and fun-filled memories',
          buttonText: '📖 Browse Adventures',
          ctaTitle: 'Ready for Adventure?',
          ctaButton: '🌲 Join the Adventure',
          yearTitle: '📆 Adventure Years'
        },
        'captain-hooks-log': {
          heroTitle: "Welcome to Peter Pan Boca Test",
          heroSubtitle: '',
          heroIcons: '⚓🚢👑',
          sectionTitle: '⚓ Ship\'s Log',
          sectionSubtitle: 'Peruse our most distinguished maritime events and elegant gatherings',
          buttonText: '⚓ View Chronicles',
          ctaTitle: 'Ready to Set Sail?',
          ctaButton: '⚓ Come Aboard',
          yearTitle: '⏰ Maritime Archives'
        }
      };

      setThemeContent(themeTexts[currentTheme as keyof typeof themeTexts] || themeTexts['captain-hooks-log']);
    };

    updateContent();
    window.addEventListener('theme-change', updateContent);
    return () => window.removeEventListener('theme-change', updateContent);
  }, []);

  const featuredEvents = getFeaturedEvents(3);
  const years = getYears();

  return (
    <div style={{ 
      paddingBottom: '4rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Hero Section */}
      <section 
        data-hero
        style={{ 
          padding: '6rem 2rem',
          textAlign: 'center',
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            {themeContent.heroIcons}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {themeContent.heroTitle}
          </h1>
          {themeContent.heroSubtitle && (
            <p style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
              marginBottom: '3rem',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.4'
            }}>
              {themeContent.heroSubtitle}
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/galleries" 
              data-button
              style={{ 
                padding: '1rem 2rem', 
                borderRadius: '10px', 
                textDecoration: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'inline-block',
                transition: 'all 0.3s',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {themeContent.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {themeContent.sectionTitle}
            </h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              {themeContent.sectionSubtitle}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {featuredEvents.map((event) => (
              <Link 
                key={`${event.year}-${event.slug}`}
                href={`/galleries/${event.year}/${event.slug}`}
                data-card
                style={{
                  textDecoration: 'none',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
              >
                <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                  <Image
                    src={event.coverImage.src}
                    alt={event.coverImage.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    color: 'white',
                    padding: '1rem'
                  }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', margin: '0' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ lineHeight: '1.6', margin: '0' }}>
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Years Overview */}
      <section data-card style={{ padding: '4rem 2rem', margin: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {themeContent.yearTitle}
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Journey through years of magical memories
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {years.map((year) => (
              <Link 
                key={year}
                href={`/galleries/${year}`}
                data-button
                style={{
                  padding: '1.5rem 2.5rem',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div 
            data-card
            style={{
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
              ✨
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {themeContent.ctaTitle}
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Join us for upcoming Peter Pan events and create magical memories that will last a lifetime.
            </p>
            <Link 
              href="/about" 
              data-button
              style={{
                padding: '1rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'inline-block',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {themeContent.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}