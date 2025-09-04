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
      />
      
      <div className="text-center text-sm text-gray-600">
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
      </div>
    </div>
  );
}