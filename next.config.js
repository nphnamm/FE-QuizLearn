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
  // Use a configuration that allows for both static and server components
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
