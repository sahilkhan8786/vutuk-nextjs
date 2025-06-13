import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.etsystatic.com',
        protocol: 'https',
    }
    ]
  }
};

export default nextConfig;
