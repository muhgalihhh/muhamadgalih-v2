"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import SkillIcon from "@/components/ui/SkillIcon";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ProjectDetailModal from "@/components/works/ProjectDetailModal";
import GalleryDetailModal from "@/components/works/GalleryDetailModal";
import SpotifyCard from "@/components/ui/SpotifyCard";
import type { Project, GalleryItem, ProjectCategoryRow, ProjectLink, Experience } from "@/types/portfolio";

type Category = string;

const staticProjects = [
  {
    id: "s1",
    title: "Full-Stack Web App",
    category: "software" as Category,
    description: "End-to-end web application with real-time features, authentication, and a dashboard built with Next.js and Supabase. Includes role-based access control and live notifications.",
    color_class: "bg-violet", text_color_class: "text-cream",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    image_urls: [],
    emoji: "⚡", link: "#", links: [], experience_id: null,
  },
  {
    id: "s2",
    title: "Brand Identity System",
    category: "uiux" as Category,
    description: "Complete brand identity for an Indonesian startup: logo, typography, color system, and brand guidelines delivered as a 40-page PDF and Figma library.",
    color_class: "bg-coral", text_color_class: "text-cream",
    tech_stack: ["Figma", "Illustrator"],
    image_urls: [],
    emoji: "🎨", link: "#", links: [], experience_id: null,
  },
  {
    id: "s3",
    title: "Analytics Dashboard",
    category: "uiux" as Category,
    description: "Data analytics dashboard with complex chart visualizations, dark mode support, and a fully responsive layout designed for both desktop and mobile use.",
    color_class: "bg-sky", text_color_class: "text-ink",
    tech_stack: ["React", "Recharts", "Figma"],
    image_urls: [],
    emoji: "📊", link: "#", links: [], experience_id: null,
  },
  {
    id: "s4",
    title: "Character Illustration Series",
    category: "illustration" as Category,
    description: "Original cartoon character series featuring 12 unique illustrated characters, each with distinct personalities and backstories. Designed for a web comic and merchandise line.",
    color_class: "bg-yellow", text_color_class: "text-ink",
    tech_stack: ["Procreate", "Illustrator", "Photoshop"],
    image_urls: [],
    emoji: "✏️", link: "#", links: [], experience_id: null,
  },
  {
    id: "s5",
    title: "Fintech Mobile App",
    category: "uiux" as Category,
    description: "UI/UX design for a fintech mobile app spanning 40+ screens, a full component library, and an interactive prototype built in ProtoPie for investor demos.",
    color_class: "bg-mint", text_color_class: "text-ink",
    tech_stack: ["Figma", "ProtoPie"],
    image_urls: [],
    emoji: "📱", link: "#", links: [], experience_id: null,
  },
  {
    id: "s6",
    title: "REST API Service",
    category: "software" as Category,
    description: "Scalable REST API with JWT auth, rate limiting, webhooks, and auto-generated OpenAPI docs. Deployed on Railway with Redis caching for sub-50ms response times.",
    color_class: "bg-pink", text_color_class: "text-ink",
    tech_stack: ["Node.js", "Express", "PostgreSQL", "Redis"],
    image_urls: [],
    emoji: "🔧", link: "#", links: [], experience_id: null,
  },
];

const staticGalleryItems = [
  { id: 1, color: "bg-violet",  label: "Character Design", emoji: "🎭" },
  { id: 2, color: "bg-coral",   label: "Brand Identity",   emoji: "🌟" },
  { id: 3, color: "bg-sky",     label: "UI Screens",       emoji: "📱" },
  { id: 4, color: "bg-yellow",  label: "Poster Art",       emoji: "🎨" },
  { id: 5, color: "bg-mint",    label: "Illustration",     emoji: "✏️" },
  { id: 6, color: "bg-pink",    label: "Motion Design",    emoji: "🎬" },
  { id: 7, color: "bg-navy",    label: "Typography",       emoji: "🔤" },
  { id: 8, color: "bg-coral",   label: "Iconography",      emoji: "⚡" },
  { id: 9, color: "bg-violet",  label: "Sticker Pack",     emoji: "🤌" },
];

/* Pola bento asimetris — besar/kecil/tinggi/lebar berulang per index.
   col-span max 2 → aman di mobile (2 kolom) maupun desktop (4 kolom). */
const bentoSpans = [
  "col-span-2 row-span-2", // big square
  "col-span-2 row-span-1", // wide
  "col-span-1 row-span-1", // small
  "col-span-1 row-span-2", // tall
  "col-span-1 row-span-1", // small
  "col-span-1 row-span-1", // small
  "col-span-2 row-span-1", // wide
  "col-span-1 row-span-2", // tall
];
const bentoSpan = (i: number) => bentoSpans[i % bentoSpans.length];

// Same asymmetric rhythm as the homepage's "Selected Works" bento — every
// card stays tall (row-span-2) so the preview image reads clearly; only the
// column width varies.
const projectSizeMap = ["hero", "side", "half", "half", "side", "hero"];
const projectSizeClasses: Record<string, string> = {
  hero: "md:col-span-4 md:row-span-2",
  half: "md:col-span-3 md:row-span-2",
  side: "md:col-span-2 md:row-span-2",
};

const FALLBACK_CATEGORIES: ProjectCategoryRow[] = [
  { id: "1", slug: "software",     label: "Software",     order_index: 0, show_in_gallery: false, created_at: "" },
  { id: "2", slug: "uiux",         label: "UI/UX",        order_index: 1, show_in_gallery: true,  created_at: "" },
  { id: "3", slug: "illustration", label: "Illustration", order_index: 2, show_in_gallery: true,  created_at: "" },
];

type ProjectRow = {
  id: string;
  title: string;
  category: Category;
  description: string;
  color_class: string;
  text_color_class: string;
  tech_stack: string[];
  image_urls: string[];
  emoji: string;
  links: ProjectLink[];
  experience_id: string | null;
};

function toRow(p: Project): ProjectRow {
  return {
    id: p.id,
    title: p.title,
    category: p.category as Category,
    description: p.description,
    color_class: p.color_class,
    text_color_class: p.text_color_class,
    tech_stack: p.tech_stack,
    image_urls: p.image_urls,
    emoji: p.emoji,
    links: p.links,
    experience_id: p.experience_id,
  };
}

export default function WorksContent({ dbProjects, spotifyEmbedUrl, galleryItems = [], categories: categoriesProp, experiences = [] }: { dbProjects?: Project[]; spotifyEmbedUrl?: string | null; galleryItems?: GalleryItem[]; categories?: ProjectCategoryRow[]; experiences?: Experience[] }) {
  const [active, setActive] = useState<Category>("all");
  const [modalProject, setModalProject] = useState<ProjectRow | null>(null);
  const [activeGalleryItem, setActiveGalleryItem] = useState<GalleryItem | null>(null);

  const categories = categoriesProp?.length ? categoriesProp : FALLBACK_CATEGORIES;
  const filters = [
    { label: "All", value: "all" },
    ...categories.map((c) => ({ label: c.label, value: c.slug })),
  ];
  const categoryLabel = Object.fromEntries(filters.map((f) => [f.value, f.label]));
  const experienceById = Object.fromEntries(experiences.map((e) => [e.id, e]));

  const projects: ProjectRow[] = dbProjects?.length
    ? dbProjects.map(toRow)
    : staticProjects;

  const filtered = projects.filter((p) => active === "all" || p.category === active);

  return (
    <main className="md:pt-20">
      {/* ── Header ── */}
      <section className="pt-20 md:pt-28 pb-10 md:pb-12 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="MY WORKS"
            className="font-display font-extrabold text-ink text-[clamp(2rem,7vw,5.5rem)] leading-none mb-4"
          />
          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="w-20 h-1.5 bg-coral rounded-full mb-6" />
            <p className="font-body text-muted text-base md:text-lg max-w-xl">
              A curated selection of projects spanning full-stack engineering,
              UI/UX design, and illustration.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Projects bento grid ── */}
      <section className="pt-6 md:pt-8 pb-16 md:pb-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Filter tabs */}
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="flex gap-3 mb-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActive(f.value)}
                  className={`font-body font-semibold px-5 py-2 rounded-full transition-all cartoon-border text-sm whitespace-nowrap shrink-0 ${
                    active === f.value ? "bg-navy text-cream" : "bg-transparent text-ink hover:bg-yellow"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="font-body text-muted text-xs md:text-sm mb-8 md:mb-10">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
              {active !== "all" ? ` in ${categoryLabel[active] ?? active}` : ""}
            </p>
          </ScrollReveal>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 [grid-auto-rows:170px] md:[grid-auto-rows:175px]">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const size = projectSizeMap[i % projectSizeMap.length];
                const preview = project.image_urls?.[0];
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className={`card-surface col-span-1 row-span-2 ${projectSizeClasses[size] ?? ""} ${project.color_class} cartoon-border rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform min-h-[320px]`}
                    onClick={() => setModalProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setModalProject(project);
                      }
                    }}
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

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted">
              <p className="font-body">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Song when I dev ── */}
      {spotifyEmbedUrl && (
        <section className="py-16 md:py-24 bg-cream relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="w-full h-full grid-pattern-lines" />
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left: heading */}
                <div>
                  <p className="font-body text-muted text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                    ♪ on repeat while building
                  </p>
                  <h2 className="font-display font-extrabold text-ink text-[clamp(2.5rem,5vw,5rem)] leading-none mb-4">
                    Song when<br />I dev
                  </h2>
                  <div className="w-12 h-1.5 bg-coral rounded-full mb-5" />
                  <p className="font-body text-muted text-sm md:text-base max-w-xs leading-relaxed">
                    Music running in the background while I write code, design screens, or draw characters.
                  </p>
                </div>
                {/* Right: Spotify embed */}
                <SpotifyCard embedUrl={spotifyEmbedUrl} height={352} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Design Gallery ── */}
      <section className="py-20 md:py-28 bg-navy text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="DESIGN GALLERY"
            className="font-display font-extrabold text-cream text-[clamp(1.6rem,5vw,4rem)] mb-4 leading-none"
          />
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="w-16 h-1.5 bg-yellow rounded-full mb-12 md:mb-16" />
            <p className="font-body text-cream/60 text-base md:text-lg mb-12 max-w-xl">
              Illustrations, visual design, branding, and motion work. A glimpse into the creative side.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[175px] gap-3 md:gap-4 grid-flow-row-dense">
            {galleryItems.length > 0 ? (
              galleryItems.map((item, i) => (
                <ScrollReveal
                  key={item.id}
                  variant="scale-in"
                  delay={(i % 8) * 0.05}
                  className={`${bentoSpan(i)} min-h-0`}
                >
                  <div
                    onClick={() => setActiveGalleryItem(item)}
                    className="h-full w-full cartoon-border-light rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform"
                  >
                    <img
                      src={item.image_urls[0]}
                      alt={item.title || "Gallery item"}
                      className="w-full h-full object-cover block"
                    />
                    {item.image_urls.length > 1 && (
                      <span className="absolute top-3 right-3 z-20 flex items-center gap-1 cartoon-border-sm bg-black/50 text-cream text-xs font-semibold px-2 py-1 rounded-full">
                        <Images size={12} /> {item.image_urls.length}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-3 gap-0.5">
                      {item.title && (
                        <span className="font-display font-bold text-cream text-sm leading-tight w-full">{item.title}</span>
                      )}
                      {item.description && (
                        <span className="font-body text-cream/70 text-xs leading-snug w-full line-clamp-2">{item.description}</span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              /* Placeholder saat gallery masih kosong */
              staticGalleryItems.map((item, i) => (
                <ScrollReveal
                  key={item.id}
                  variant="scale-in"
                  delay={(i % 8) * 0.05}
                  className={`${bentoSpan(i)} min-h-0`}
                >
                  <div
                    className={`${item.color} h-full w-full cartoon-border rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl md:text-5xl">{item.emoji}</span>
                      <span className="font-display font-bold text-xs md:text-sm text-ink/70">{item.label}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="font-display font-bold text-cream text-sm">Coming soon</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>

          {galleryItems.length === 0 && (
            <ScrollReveal variant="fade-up" delay={0.3}>
              <p className="font-body text-cream/30 text-sm text-center mt-12">
                More works coming soon. The gallery is still being uploaded.
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>
      <ProjectDetailModal
        project={modalProject}
        categoryLabel={categoryLabel}
        experience={modalProject?.experience_id ? experienceById[modalProject.experience_id] : null}
        onClose={() => setModalProject(null)}
      />
      <GalleryDetailModal item={activeGalleryItem} onClose={() => setActiveGalleryItem(null)} />
    </main>
  );
}
