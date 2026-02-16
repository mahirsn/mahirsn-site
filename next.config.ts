import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow Server Actions to be invoked from both localhost and your domain
      allowedOrigins: ["localhost:3000", "77.90.53.55:3000", "mahirsn.net"],
    },
  },
};

export default nextConfig;
