'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const photos = [
  { src: '/images/ACJL7605.JPG', alt: 'Peter Pan Club Event', title: 'אירוע מיוחד במועדון פיטר פן' },
  { src: '/images/AMZC6816.JPG', alt: 'Peter Pan Adventure', title: 'הרפתקאות קסומות עם פיטר פן' },
  { src: '/images/IMG-20230226-WA0030.jpg', alt: 'Peter Pan Event February 2023', title: 'אירוע פברואר 2023' },
  { src: '/images/IMG-20230430-WA0048.jpg', alt: 'Peter Pan Event April 2023', title: 'אירוע פיטר פן אפריל 2023' },
  { src: '/images/IMG-20230823-WA0021.jpg', alt: 'Peter Pan Event August 2023', title: 'הרפתקאות קיץ עם פיטר פן' },
  { src: '/images/IMG-20230926-WA0023.jpg', alt: 'Peter Pan Event September 2023', title: 'חגיגת ראש השנה במועדון' },
  { src: '/images/IMG-20231209-WA0027.jpg', alt: 'Peter Pan Event December 2023', title: 'אירוע חנוכה מיוחד' },
  { src: '/images/IMG-20240126-WA0076.jpg', alt: 'Peter Pan Event January 2024', title: 'כיף משפחתי בחורף' },
  { src: '/images/IMG-20250119-WA0086.jpg', alt: 'Peter Pan Event January 2025', title: 'פעילות ינואר 2025' },
  { src: '/images/IMG-20250823-WA0057.jpg', alt: 'Peter Pan Event August 2025', title: 'הרפתקאות קיץ 2025' },
  { src: '/images/PUEJ1954.JPG', alt: 'Peter Pan Club Activity', title: 'פעילות מועדון פיטר פן' },
  { src: '/images/VYQJ4092.JPG', alt: 'Peter Pan Group Photo', title: 'תמונה קבוצתית במועדון' },
  { src: '/images/WhatsApp Image 2024-02-25 at 17.18.06_a7e6fcdc.jpg', alt: 'Peter Pan Event February 2024', title: 'רגעים קסומים פברואר 2024' },
  { src: '/images/WhatsApp Image 2024-03-09 at 11.48.13_a9fa229a.jpg', alt: 'Peter Pan Event March 2024', title: 'אירוע מרץ 2024' },
];

export default function PhotosPage() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % photos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhoto(index);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '3rem 2rem'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            📸✨🎭
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite'
          }}>
            📸 גלריית התמונות הקסומה
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            צפו ברגעים הקסומים מהאירועים שלנו - כל תמונה מספרת סיפור של הרפתקה ושמחה
          </p>
        </div>

        {/* Main Slideshow */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            aspectRatio: '16/10',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={photos[currentPhoto].src}
              alt={photos[currentPhoto].alt}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to a default image if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/images/IMG-20230430-WA0048.jpg';
              }}
            />
            
            {/* Photo Title Overlay */}
            <div style={{ 
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
                {photos[currentPhoto].title}
              </h3>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevPhoto}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                fontSize: '2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
              ←
            </button>

            <button
              onClick={nextPhoto}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                fontSize: '2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
              →
            </button>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              style={{
                border: currentPhoto === index ? '3px solid #fbbf24' : '3px solid transparent',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                width: '80px',
                height: '60px',
                position: 'relative',
                transition: 'all 0.3s',
                transform: currentPhoto === index ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/IMG-20230430-WA0048.jpg';
                }}
              />
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            data-button
            style={{
              padding: '1rem 2rem',
              borderRadius: '25px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isAutoPlaying ? '⏸️ עצור אוטומטי' : '▶️ הפעל אוטומטי'}
          </button>
        </div>

        {/* Photo Counter */}
        <div style={{ 
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}>
          תמונה {currentPhoto + 1} מתוך {photos.length}
        </div>

        {/* Call to Action */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>📷</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            רוצים להיות חלק מהקסם?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            הצטרפו לאירועים הקרובים שלנו וצרו זכרונות בלתי נשכחים עם המשפחה
          </p>
          <button
            data-button
            style={{
              padding: '1rem 2rem',
              borderRadius: '25px',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎫 הרשמה לאירועים
          </button>
        </div>
      </div>
    </div>
  );
}