import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    localPatterns: [
      {
        pathname: "/icons/**",
      },
      {
        pathname: "/images/hero-otavio.png",
        search: "?v=20260614",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
