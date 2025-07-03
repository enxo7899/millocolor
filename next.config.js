/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  // Your existing Next.js config
};

module.exports = withNextIntl(nextConfig);
