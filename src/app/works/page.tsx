import type { Metadata } from "next";
import { getPublicProjects, getPublicGalleryItems, getPublicCategories, getPublicExperiences } from "@/lib/data/portfolio";
import WorksContent from "./WorksContent";

export const metadata: Metadata = {
  title: "Works · Muhamad Galih · MIZARIE",
  description: "Portfolio of software, data science, UI/UX, and illustration projects by Muhamad Galih (MIZARIE).",
};

export default async function WorksPage() {
  const [projects, galleryItems, categories, experiences] = await Promise.all([
    getPublicProjects(),
    getPublicGalleryItems(),
    getPublicCategories(),
    getPublicExperiences(),
  ]);
  return (
    <WorksContent
      dbProjects={projects}
      galleryItems={galleryItems}
      categories={categories}
      experiences={experiences}
    />
  );
}
