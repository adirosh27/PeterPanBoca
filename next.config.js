/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Gallery photos are served from Vercel Blob (see scripts/upload-photos.js)
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/images/**' },
    ],
  },
  outputFileTracingExcludes: {
    '/api/photos': ['./public/images/**', './public/Photos/**'],
    '/api/gallery-admin': ['./public/images/**', './public/Photos/**'],
  },
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig