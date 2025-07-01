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
    ]
  },
  experimental: {
    serverActions: {
     bodySizeLimit:'5mb'
   }
 }
};

export default nextConfig;
