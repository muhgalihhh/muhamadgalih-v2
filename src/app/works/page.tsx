import type { Metadata } from "next";
import { getPublicProjects, getProfile, getPublicGalleryItems, getPublicCategories } from "@/lib/data/portfolio";
import WorksContent from "./WorksContent";

export const metadata: Metadata = {
  title: "Works · Muhamad Galih · MIZARIE",
  description: "Portfolio of projects, UI/UX work, and illustration by Muhamad Galih (MIZARIE).",
};

export default async function WorksPage() {
  const [projects, profile, galleryItems, categories] = await Promise.all([
    getPublicProjects(),
    getProfile(),
    getPublicGalleryItems(),
    getPublicCategories(),
  ]);
  return (
    <WorksContent
      dbProjects={projects}
      spotifyEmbedUrl={profile?.spotify_embed_url}
      galleryItems={galleryItems}
      categories={categories}
    />
  );
}
