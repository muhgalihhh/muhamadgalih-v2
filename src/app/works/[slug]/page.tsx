import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCategories, getPublicProjectBySlug } from "@/lib/data/portfolio";
import ProjectContent from "@/components/works/ProjectContent";
import ProjectCarousel from "@/components/works/ProjectCarousel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ProjectHeader from "./ProjectHeader";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return { title: "Project not found · MIZARIE" };
  const description = project.description.length > 160 ? `${project.description.slice(0, 157)}…` : project.description;
  return {
    title: `${project.title} · Works · Muhamad Galih · MIZARIE`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.image_urls[0] ? [project.image_urls[0]] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, categories] = await Promise.all([getPublicProjectBySlug(slug), getPublicCategories()]);
  if (!project) notFound();

  const categoryLabel = categories.find((c) => c.slug === project.category)?.label ?? project.category;

  return (
    <main className="md:pt-20 bg-cream min-h-screen">
      <ProjectHeader project={project} categoryLabel={categoryLabel} experience={project.experience} />

      {project.image_urls.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-12 md:-mt-14 relative z-10">
          <ScrollReveal variant="scale-in" once className="cartoon-border rounded-2xl overflow-hidden bg-cream">
            <ProjectCarousel images={project.image_urls} title={project.title} />
          </ScrollReveal>
        </div>
      )}

      <article className="max-w-[720px] mx-auto px-6 pt-12 pb-28 md:pb-24">
        <ProjectContent content={project.content} description={project.description} />
      </article>
    </main>
  );
}
