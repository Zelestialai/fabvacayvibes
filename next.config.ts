import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uc.orez.io',
      },
      {
        protocol: 'https',
        hostname: 'ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
