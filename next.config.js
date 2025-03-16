/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
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
  // Custom webpack config to handle errors when copying files
  webpack: (config, { isServer }) => {
    // Ignore ENOENT errors when copying route group files
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
};

module.exports = nextConfig;
