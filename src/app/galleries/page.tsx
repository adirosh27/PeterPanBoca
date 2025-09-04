'use client';

import Link from 'next/link';
import Image from 'next/image';
import { galleryData } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function GalleriesPage() {
  const [themeContent, setThemeContent] = useState({
    title: '⚓ Maritime Archives',
    subtitle: 'Peruse our distinguished collection of elegant nautical events'
  });

  useEffect(() => {
    const updateContent = () => {
      const currentTheme = (window as any).currentTheme || 'captain-hooks-log';
      
      const themeTexts = {
        'neverland-night': {
          title: '🌟 Photo Galleries',
          subtitle: 'Explore our magical collection of Neverland adventures, organized by year'
        },
        'skull-rock-shores': {
          title: '🏴‍☠️ Treasure Galleries',
          subtitle: 'Browse our collection of swashbuckling adventures across the seven seas'
        },
        'pixie-dust-pastels': {
          title: '✨ Magical Galleries', 
          subtitle: 'Discover our enchanting collection of fairy tale moments and dreams'
        },
        'lost-boys-scrapbook': {
          title: '📖 Adventure Albums',
          subtitle: 'Flip through our handcrafted collection of wilderness memories'
        },
        'captain-hooks-log': {
          title: '⚓ Maritime Archives',
          subtitle: 'Peruse our distinguished collection of elegant nautical events'
        }
      };

      setThemeContent(themeTexts[currentTheme as keyof typeof themeTexts] || themeTexts['captain-hooks-log']);
    };

    updateContent();
    window.addEventListener('theme-change', updateContent);
    return () => window.removeEventListener('theme-change', updateContent);
  }, []);

  // Sort years in descending order (newest first)
  const sortedData = [...galleryData].sort((a, b) => b.year - a.year);

  return (
    <div style={{ padding: '3rem 2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            {themeContent.title}
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            {themeContent.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {sortedData.map((yearData) => (
            <section key={yearData.year} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {yearData.year}
                </h2>
                <div style={{ 
                  width: '100px', 
                  height: '4px', 
                  margin: '0 auto',
                  borderRadius: '2px'
                }} data-button />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {yearData.events.map((event) => (
                  <Link 
                    key={event.slug}
                    href={`/galleries/${yearData.year}/${event.slug}`}
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
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                          {event.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', margin: '0' }}>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                        {event.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                        <span>{event.photos.length} photos</span>
                        <svg style={{ width: '16px', height: '16px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}