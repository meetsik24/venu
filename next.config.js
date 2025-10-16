/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://venu-engine.onrender.com';
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
    return [
      {
        source: `/api/${apiVersion}/:path*`,
        destination: `${apiBase}/api/${apiVersion}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
