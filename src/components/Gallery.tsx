'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Photo } from '@/lib/data';

interface GalleryProps {
  photos: Photo[];
  title?: string;
}

export default function Gallery({ photos, title }: GalleryProps) {
  const [index, setIndex] = useState(-1);

  // Transform our Photo interface to match react-photo-album's expected format
  const albumPhotos = photos.map(photo => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    title: photo.title,
  }));

  // Transform for lightbox (includes titles in slides)
  const lightboxSlides = photos.map(photo => ({
    src: photo.src,
    alt: photo.alt,
    title: photo.title,
    width: photo.width,
    height: photo.height,
  }));

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-display font-semibold text-gray-800 text-center">
          {title}
        </h2>
      )}
      
      <PhotoAlbum
        photos={albumPhotos}
        layout="masonry"
        onClick={({ index: current }) => setIndex(current)}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
          <div style={wrapperStyle} className="relative group cursor-pointer">
            {renderDefaultPhoto({ wrapped: true })}
            {photo.title && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="font-medium text-sm">{photo.title}</h3>
                </div>
              </div>
            )}
          </div>
        )}
      />

      <Lightbox
        slides={lightboxSlides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Thumbnails]}
        thumbnails={{
          position: 'bottom',
          width: 100,
          height: 100,
          border: 2,
          borderRadius: 4,
          gap: 16,
        }}
        render={{
          slide: ({ slide }) => (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={slide.src}
                alt={slide.alt || ''}
                width={slide.width}
                height={slide.height}
                className="max-w-full max-h-full object-contain"
                priority
              />
              {slide.title && (
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-lg font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    {slide.title}
                  </h3>
                </div>
              )}
            </div>
          ),
        }}
      />
      
      <div className="text-center text-sm text-gray-600">
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
      </div>
    </div>
  );
}