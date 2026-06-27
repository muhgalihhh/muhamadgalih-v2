import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB — raise so larger photo uploads don't fail.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
