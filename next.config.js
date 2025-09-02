/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  // Allow external images from official manufacturer websites
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rupes.com',
        port: '',
        pathname: '/media/catalog/product/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sata.com',
        port: '',
        pathname: '/assets/cms/**',
      },
      {
        protocol: 'https',
        hostname: 'www.roberlo.com',
        port: '',
        pathname: '/media/catalog/product/**',
      },
    ],
  },
  // Your existing Next.js config
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate', // 1 day instead of 1 year
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for static assets
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
