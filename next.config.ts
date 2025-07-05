import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-middleware-rewrite',
            value: 'https://vutuk-nextjs.vercel.app/api/auth'
          }
        ]
      }
    ]
},


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
     bodySizeLimit:'200mb'
    },
    
 }
};

export default nextConfig;
