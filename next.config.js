/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NETWORK_PROVIDER: process.env.NETWORK_PROVIDER || '',
  },
}

module.exports = nextConfig
