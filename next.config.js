/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_SERVER_URI + "/api/:path*",
      },
    ];
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  // Use hybrid approach
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
