"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import ProjectDetailModal from "@/components/works/ProjectDetailModal";
import type { Project } from "@/types/portfolio";

type Category = "all" | "software" | "uiux" | "illustration";

const staticProjects = [
  { id: "s1", title: "Full-Stack Web App",    category: "software" as const,      description: "End-to-end web application with real-time features, authentication, and a dashboard built with Next.js and Supabase.", color_class: "bg-violet", text_color_class: "text-cream", tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"], image_urls: [], emoji: "⚡", link: "/works", order_index: 0, published: true, created_at: "" },
  { id: "s2", title: "Brand Identity",        category: "uiux" as const,          description: "Complete brand identity design for an Indonesian startup.",                                                                color_class: "bg-coral",  text_color_class: "text-cream", tech_stack: ["Figma", "Illustrator"],                          image_urls: [], emoji: "🎨", link: "/works", order_index: 1, published: true, created_at: "" },
  { id: "s3", title: "Dashboard UI",          category: "uiux" as const,          description: "Data analytics dashboard with complex visualizations and dark mode support.",                                              color_class: "bg-sky",    text_color_class: "text-ink",   tech_stack: ["React", "Recharts", "Figma"],                    image_urls: [], emoji: "📊", link: "/works", order_index: 2, published: true, created_at: "" },
  { id: "s4", title: "Character Illustration",category: "illustration" as const,  description: "Original cartoon character series featuring 12 unique illustrated characters.",                                           color_class: "bg-yellow", text_color_class: "text-ink",   tech_stack: ["Procreate", "Illustrator", "Photoshop"],         image_urls: [], emoji: "✏️", link: "/works", order_index: 3, published: true, created_at: "" },
  { id: "s5", title: "Fintech Mobile App",    category: "uiux" as const,          description: "UI/UX design for a fintech mobile app with 40+ screens and an interactive prototype.",                                   color_class: "bg-mint",   text_color_class: "text-ink",   tech_stack: ["Figma", "ProtoPie"],                             image_urls: [], emoji: "📱", link: "/works", order_index: 4, published: true, created_at: "" },
  { id: "s6", title: "REST API Service",      category: "software" as const,      description: "Scalable REST API with auth, rate limiting, and auto-generated OpenAPI docs.",                                           color_class: "bg-pink",   text_color_class: "text-ink",   tech_stack: ["Node.js", "Express", "PostgreSQL", "Redis"],    image_urls: [], emoji: "🔧", link: "/works", order_index: 5, published: true, created_at: "" },
];

const sizeMap = ["featured", "small", "small", "wide", "medium", "medium"];
const sizeClasses: Record<string, string> = {
  featured: "md:col-span-2 md:row-span-2",
  wide:     "md:col-span-4",
  medium:   "md:col-span-2",
  small:    "md:col-span-1",
};

const filters: { label: string; value: Category }[] = [
  { label: "All",          value: "all" },
  { label: "Software",     value: "software" },
  { label: "UI/UX",        value: "uiux" },
  { label: "Illustration", value: "illustration" },
];

const categoryLabel: Record<string, string> = {
  software: "Software", uiux: "UI/UX", illustration: "Illustration",
};

export default function Works({ dbProjects }: { dbProjects?: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 [grid-auto-rows:180px] md:[grid-auto-rows:220px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const size = sizeMap[i % sizeMap.length];
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`col-span-1 ${sizeClasses[size] ?? ""} ${project.color_class} cartoon-border rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform min-h-[160px]`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={`p-4 md:p-6 h-full flex flex-col justify-between ${project.text_color_class}`}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl md:text-4xl flex items-center">
                        {project.emoji ? <SkillIcon icon={project.emoji} className="w-8 h-8 md:w-10 md:h-10" /> : "✦"}
                      </span>
                      <span className={`cartoon-border-sm bg-black/10 font-body text-xs px-2 md:px-3 py-1 rounded-full ${project.text_color_class}`}>
                        {categoryLabel[project.category] ?? project.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-lg md:text-2xl leading-tight">
                        {project.title}
                      </h3>
                      <p className="font-body text-xs md:text-sm opacity-70 mt-1 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech badges on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/50 to-transparent flex flex-wrap gap-1.5 md:gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="cartoon-border-sm bg-cream text-ink px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-body font-semibold rounded-full">
                        {tech}
                      </span>
                    ))}
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
              className="cartoon-border bg-navy text-cream font-body font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform inline-flex items-center gap-2"
            >
              View all works ✦
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
