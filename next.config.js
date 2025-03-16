/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api-quizlearn.onrender.com/api/:path*",
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
