import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // @ts-ignore - allowedDevOrigins is valid in this version but types might be lagging
    allowedDevOrigins: ["mahirsn.net", "77.90.53.55:3000", "localhost:3000"],
    serverActions: {
      // Allow Server Actions to be invoked from both localhost and your domain
      allowedOrigins: ["localhost:3000", "77.90.53.55:3000", "mahirsn.net"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
