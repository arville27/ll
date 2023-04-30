/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@ll/common'],
  output: 'standalone',
};

module.exports = nextConfig;
