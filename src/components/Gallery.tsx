'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/lib/data';
import PhotoLightbox from './PhotoLightbox';

interface GalleryProps {
  photos: Photo[];
  title?: string;
}

export default function Gallery({ photos, title }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Debug logging
  console.log('Gallery received photos:', photos?.length || 0, photos);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No photos available for this event.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          {title}
        </h2>
      )}
      
      {/* Photo Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {photos.map((photo, index) => (
          <div
            key={index}
            data-card
            style={{
              borderRadius: '15px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative'
            }}
            onClick={() => setLightboxIndex(index)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            <div style={{ position: 'relative', height: '250px' }}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: 'cover' }}
              />
              {photo.title && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {photo.title}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.9rem', opacity: '0.7' }}>
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'} • Click any photo to view larger
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}