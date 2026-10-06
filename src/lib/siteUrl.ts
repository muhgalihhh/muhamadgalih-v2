// Absolute origin for metadata, sitemap and robots. On Vercel the production
// domain is provided automatically; NEXT_PUBLIC_SITE_URL wins when set.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
