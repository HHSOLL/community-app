/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko'
  }
};

export default nextConfig;
