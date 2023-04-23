/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@ll/common'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
