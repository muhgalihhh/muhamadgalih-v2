import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB — raise so larger photo uploads don't fail.
      bodySizeLimit: "15mb",
    },
  },
  // sharp's native module loads libvips-cpp.so through the dynamic linker, which
  // file tracing can't see — without this the .so is missing on Vercel and every
  // admin server action (including sign-in) fails at import time.
  outputFileTracingIncludes: {
    "/admin/**": ["./node_modules/@img/sharp-libvips-linux-x64/lib/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "nzmvgjjepavdtynscaui.supabase.co" },
    ],
  },
};

export default nextConfig;
