import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/data/portfolio";
import { SITE_URL } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublicProjects();
  return [
    ...["", "/about", "/works", "/contact"].map((path) => ({ url: `${SITE_URL}${path}` })),
    ...projects.map((p) => ({ url: `${SITE_URL}/works/${p.slug}`, lastModified: p.project_date ?? undefined })),
  ];
}
