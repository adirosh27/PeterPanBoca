'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Upcoming events data
const UPCOMING_EVENTS = [
  {
    id: 'family-friday-dinner',
    name: 'ארוחת שישי משפחות',
    date: '2026-01-30T19:30:00',
    address: 'Boca Falls Club House',
    fullAddress: '21700 Boca Falls Dr, Boca Raton, FL 33428'
  }
];

// Countdown Timer Component
function CountdownTimer({ targetDate, eventName, address, fullAddress }: { targetDate: string, eventName: string, address?: string, fullAddress?: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return null; // Don't show expired events
  }

  return (
    <div
      data-card
      style={{
        borderRadius: '20px',
        padding: 'clamp(1rem, 4vw, 2rem)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(251, 191, 36, 0.1))',
        border: '2px solid rgba(16, 185, 129, 0.2)',
        marginBottom: '2rem'
      }}
    >
      <h3 style={{
        fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#10b981'
      }}>
        🎭 האירוע הקרוב: {eventName}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {[
          { label: 'ימים', value: timeLeft.days },
          { label: 'שעות', value: timeLeft.hours },
          { label: 'דקות', value: timeLeft.minutes },
          { label: 'שניות', value: timeLeft.seconds }
        ].map((item, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #10b981, #fbbf24)',
            color: 'white',
            padding: 'clamp(0.75rem, 3vw, 1rem)',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.25rem' }}>{item.value}</div>
            <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)' }}>{item.label}</div>
          </div>
        ))}
      </div>
      {address && (
        <div style={{
          marginTop: '1.5rem',
          padding: 'clamp(0.75rem, 3vw, 1rem)',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '10px',
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: 'clamp(1rem, 3vw, 1.1rem)' }}>
            📍 {address}
          </div>
          {fullAddress && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                color: '#2563eb',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '0.5rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
            >
              🗺️ {fullAddress}
            </a>
          )}
          <div style={{ marginTop: '0.75rem', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: '#6b7280' }}>
            ⏰ {new Date(targetDate).toLocaleString('he-IL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
      const currentTheme = 'captain-hooks-log';
      
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
          heroTitle: "ברוכים הבאים לקבוצת פיטר פן בבוקה רטון",
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
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)',
          textAlign: 'center',
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: 'clamp(1rem, 4vw, 2rem)', animation: 'bounce 2s infinite' }}>
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

          {/* Video Section within Hero */}

          <div 
            data-card
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              maxWidth: '700px',
              margin: '0 auto',
              aspectRatio: '16/9'
            }}
          >
            <video
              controls
              muted
              playsInline
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              poster="/videos/video-thumbnail.jpg"
              onMouseEnter={(e) => {
                const video = e.currentTarget;
                if (window.innerWidth > 768) { // Only on desktop
                  console.log('Desktop hover detected, trying to play video');
                  video.play().then(() => {
                    console.log('Video started playing');
                  }).catch((error) => {
                    console.log('Failed to play video:', error);
                  });
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget;
                if (window.innerWidth > 768) { // Only on desktop
                  console.log('Mouse left, pausing video');
                  video.pause();
                  video.currentTime = 0; // Reset to beginning
                }
              }}
              onClick={(e) => {
                const video = e.currentTarget;
                console.log('Video clicked');
                if (video.paused) {
                  video.play().then(() => {
                    console.log('Video started playing after click');
                  }).catch((error) => {
                    console.log('Failed to play video after click:', error);
                  });
                } else {
                  video.pause();
                  console.log('Video paused after click');
                }
              }}
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              <source src="/videos/hero-video.webm" type="video/webm" />
              הדפדפן שלכם לא תומך בוידיאו HTML5.
            </video>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {(() => {
            // Find the next upcoming event
            const now = new Date();
            const nextEvent = UPCOMING_EVENTS.find(event => new Date(event.date) > now);

            if (nextEvent) {
              return (
                <CountdownTimer
                  targetDate={nextEvent.date}
                  eventName={nextEvent.name}
                  address={nextEvent.address}
                  fullAddress={nextEvent.fullAddress}
                />
              );
            }
            return null;
          })()}
        </div>
      </section>

      {/* World Cup Prediction CTA */}
      <section style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/worldcup" style={{ textDecoration: 'none' }}>
            <div
              data-card
              style={{
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(251, 191, 36, 0.12))',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '0.5rem' }}>⚽🏆</div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: '#10b981'
              }}>
                תחרות הניחושים - מונדיאל 2026
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                color: '#4b5563',
                direction: 'rtl',
                marginBottom: '1.25rem'
              }}>
                כל חבר מנחש פעם אחת מי יזכה בגביע העולם 🏆
              </p>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(45deg, #10b981, #fbbf24)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1.75rem',
                borderRadius: '25px',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)'
              }}>
                ⚽ לניחוש שלי
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Founded Section */}
      <section style={{
        padding: 'clamp(1rem, 4vw, 2rem)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          padding: '1rem 2rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)'
        }}>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#4b5563',
            direction: 'rtl'
          }}>
            🎉 הקבוצה נוסדה ב-23 בנובמבר 2021
          </p>
        </div>
      </section>

    </div>
  );
}