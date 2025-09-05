'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Photo } from '@/lib/data';

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({ photos, currentIndex, onClose }: PhotoLightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, photos.length]);

  const currentPhoto = photos[index];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}
      >
        ×
      </button>

      {/* Previous button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
          }}
          style={{
            position: 'absolute',
            left: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
          }}
          style={{
            position: 'absolute',
            right: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
        >
          ›
        </button>
      )}

      {/* Main image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          position: 'relative'
        }}
      >
        <Image
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          width={currentPhoto.width}
          height={currentPhoto.height}
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '10px'
          }}
        />
        
        {/* Photo info */}
        {currentPhoto.title && (
          <div
            style={{
              position: 'absolute',
              bottom: '-3rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            {currentPhoto.title}
          </div>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '-3rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}
          >
            {index + 1} of {photos.length}
          </div>
        )}
      </div>
    </div>
  );
}