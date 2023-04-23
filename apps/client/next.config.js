/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@ll/common'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
