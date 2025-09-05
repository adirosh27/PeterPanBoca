/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig