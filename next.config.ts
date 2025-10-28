import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.etsystatic.com',
        protocol: 'https',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb'
    }
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://vutuk-nextjs.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
