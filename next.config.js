/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./i18n.ts');
// Bundle analyzer - only load if available
let withBundleAnalyzer = (config) => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.log('Bundle analyzer not available, skipping...');
}

const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'gsap', 'three'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Image optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
