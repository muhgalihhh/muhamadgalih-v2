"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import ProjectDetailModal from "@/components/works/ProjectDetailModal";
import type { Project, ProjectCategoryRow } from "@/types/portfolio";

type Category = string;

const staticProjects = [
  { id: "s1", title: "Full-Stack Web App",    category: "software" as const,      description: "End-to-end web application with real-time features, authentication, and a dashboard built with Next.js and Supabase.", color_class: "bg-violet", text_color_class: "text-cream", tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"], image_urls: [], emoji: "⚡", link: "/works", order_index: 0, project_date: null, published: true, created_at: "" },
  { id: "s2", title: "Brand Identity",        category: "uiux" as const,          description: "Complete brand identity design for an Indonesian startup.",                                                                color_class: "bg-coral",  text_color_class: "text-cream", tech_stack: ["Figma", "Illustrator"],                          image_urls: [], emoji: "🎨", link: "/works", order_index: 1, project_date: null, published: true, created_at: "" },
  { id: "s3", title: "Dashboard UI",          category: "uiux" as const,          description: "Data analytics dashboard with complex visualizations and dark mode support.",                                              color_class: "bg-sky",    text_color_class: "text-ink",   tech_stack: ["React", "Recharts", "Figma"],                    image_urls: [], emoji: "📊", link: "/works", order_index: 2, project_date: null, published: true, created_at: "" },
  { id: "s4", title: "Character Illustration",category: "illustration" as const,  description: "Original cartoon character series featuring 12 unique illustrated characters.",                                           color_class: "bg-yellow", text_color_class: "text-ink",   tech_stack: ["Procreate", "Illustrator", "Photoshop"],         image_urls: [], emoji: "✏️", link: "/works", order_index: 3, project_date: null, published: true, created_at: "" },
  { id: "s5", title: "Fintech Mobile App",    category: "uiux" as const,          description: "UI/UX design for a fintech mobile app with 40+ screens and an interactive prototype.",                                   color_class: "bg-mint",   text_color_class: "text-ink",   tech_stack: ["Figma", "ProtoPie"],                             image_urls: [], emoji: "📱", link: "/works", order_index: 4, project_date: null, published: true, created_at: "" },
  { id: "s6", title: "REST API Service",      category: "software" as const,      description: "Scalable REST API with auth, rate limiting, and auto-generated OpenAPI docs.",                                           color_class: "bg-pink",   text_color_class: "text-ink",   tech_stack: ["Node.js", "Express", "PostgreSQL", "Redis"],    image_urls: [], emoji: "🔧", link: "/works", order_index: 5, project_date: null, published: true, created_at: "" },
];

// Asymmetric bento — every card is tall (row-span-2) so the preview image stays
// clearly visible; only the column width varies for an editorial, "cool" rhythm.
const sizeMap = ["hero", "side", "half", "half", "side", "hero"];
const sizeClasses: Record<string, string> = {
  hero: "md:col-span-4 md:row-span-2", // wide feature
  half: "md:col-span-3 md:row-span-2", // balanced pair
  side: "md:col-span-2 md:row-span-2", // narrow but still tall
};

const FALLBACK_CATEGORIES: ProjectCategoryRow[] = [
  { id: "1", slug: "software",     label: "Software",     order_index: 0, created_at: "" },
  { id: "2", slug: "uiux",         label: "UI/UX",        order_index: 1, created_at: "" },
  { id: "3", slug: "illustration", label: "Illustration", order_index: 2, created_at: "" },
];

export default function Works({ dbProjects, categories: categoriesProp }: { dbProjects?: Project[]; categories?: ProjectCategoryRow[] }) {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = categoriesProp?.length ? categoriesProp : FALLBACK_CATEGORIES;
  const filters = [
    { label: "All", value: "all" },
    ...categories.map((c) => ({ label: c.label, value: c.slug })),
  ];
  const categoryLabel = Object.fromEntries(filters.map((f) => [f.value, f.label]));

  const projects = dbProjects?.length ? dbProjects : staticProjects;

  const filtered = projects.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <section id="works" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      {/* Grid line texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines" />
      </div>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        <AnimatedText
          text="SELECTED WORKS"
          className="font-display font-extrabold text-ink text-[clamp(1.6rem,5.5vw,4.5rem)] mb-4 leading-none"
        />
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="w-16 h-1.5 bg-violet rounded-full mb-8" />
        </ScrollReveal>

        {/* Filter tabs */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="flex gap-3 mb-8 md:mb-10 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`font-body font-semibold px-5 py-2 rounded-full transition-all cartoon-border text-sm whitespace-nowrap shrink-0 ${
                  activeFilter === filter.value
                    ? "bg-navy text-cream"
                    : "bg-transparent text-ink hover:bg-yellow"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 [grid-auto-rows:170px] md:[grid-auto-rows:175px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const size = sizeMap[i % sizeMap.length];
              const preview = project.image_urls?.[0];
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`card-surface col-span-1 row-span-2 ${sizeClasses[size] ?? ""} ${project.color_class} cartoon-border rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform min-h-[320px]`}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Full-bleed preview image */}
                  {preview ? (
                    <img
                      src={preview}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* No screenshot — big centered emoji on the card color */
                    <div className={`absolute inset-0 flex items-center justify-center ${project.text_color_class}`}>
                      {project.emoji ? <SkillIcon icon={project.emoji} className="w-20 h-20 md:w-24 md:h-24 opacity-90" /> : <span className="text-6xl">✦</span>}
                    </div>
                  )}

                  {/* Top row: emoji chip (over image) + category badge */}
                  <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-5 flex items-start justify-between">
                    {preview ? (
                      <span className="cartoon-border-sm bg-cream/90 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center">
                        {project.emoji ? <SkillIcon icon={project.emoji} className="w-6 h-6" /> : <span className="text-lg">✦</span>}
                      </span>
                    ) : <span />}
                    <span className="cartoon-border-sm bg-black/40 text-cream backdrop-blur-sm font-body text-xs px-3 py-1 rounded-full">
                      {categoryLabel[project.category] ?? project.category}
                    </span>
                  </div>

                  {/* Bottom gradient + text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6 pt-16 md:pt-24 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
                    <h3 className="font-display font-extrabold text-cream text-lg md:text-2xl leading-tight line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="font-body text-cream/75 text-xs md:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    {/* Tech badges reveal on hover */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-0 max-h-0 opacity-0 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100 overflow-hidden transition-all duration-300">
                      {project.tech_stack.map((tech) => (
                        <span key={tech} className="cartoon-border-sm bg-cream text-ink px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-body font-semibold rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Link to full works page */}
        <ScrollReveal variant="fade-up" delay={0.3}>
          <div className="flex justify-center mt-10 md:mt-14">
            <Link
              href="/works"
              className="cartoon-border bg-navy text-cream font-body font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform inline-flex items-center gap-2 group"
            >
              View all works
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        categoryLabel={categoryLabel}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
