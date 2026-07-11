"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "@/components/animations/AnimatedText";
import SkillIcon from "@/components/ui/SkillIcon";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ProjectCarousel from "@/components/works/ProjectCarousel";
import ProjectDetailModal from "@/components/works/ProjectDetailModal";
import SpotifyCard from "@/components/ui/SpotifyCard";
import type { Project, GalleryItem, ProjectCategoryRow } from "@/types/portfolio";

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
    emoji: "⚡", link: "#",
  },
  {
    id: "s2",
    title: "Brand Identity System",
    category: "uiux" as Category,
    description: "Complete brand identity for an Indonesian startup: logo, typography, color system, and brand guidelines delivered as a 40-page PDF and Figma library.",
    color_class: "bg-coral", text_color_class: "text-cream",
    tech_stack: ["Figma", "Illustrator"],
    image_urls: [],
    emoji: "🎨", link: "#",
  },
  {
    id: "s3",
    title: "Analytics Dashboard",
    category: "uiux" as Category,
    description: "Data analytics dashboard with complex chart visualizations, dark mode support, and a fully responsive layout designed for both desktop and mobile use.",
    color_class: "bg-sky", text_color_class: "text-ink",
    tech_stack: ["React", "Recharts", "Figma"],
    image_urls: [],
    emoji: "📊", link: "#",
  },
  {
    id: "s4",
    title: "Character Illustration Series",
    category: "illustration" as Category,
    description: "Original cartoon character series featuring 12 unique illustrated characters, each with distinct personalities and backstories. Designed for a web comic and merchandise line.",
    color_class: "bg-yellow", text_color_class: "text-ink",
    tech_stack: ["Procreate", "Illustrator", "Photoshop"],
    image_urls: [],
    emoji: "✏️", link: "#",
  },
  {
    id: "s5",
    title: "Fintech Mobile App",
    category: "uiux" as Category,
    description: "UI/UX design for a fintech mobile app spanning 40+ screens, a full component library, and an interactive prototype built in ProtoPie for investor demos.",
    color_class: "bg-mint", text_color_class: "text-ink",
    tech_stack: ["Figma", "ProtoPie"],
    image_urls: [],
    emoji: "📱", link: "#",
  },
  {
    id: "s6",
    title: "REST API Service",
    category: "software" as Category,
    description: "Scalable REST API with JWT auth, rate limiting, webhooks, and auto-generated OpenAPI docs. Deployed on Railway with Redis caching for sub-50ms response times.",
    color_class: "bg-pink", text_color_class: "text-ink",
    tech_stack: ["Node.js", "Express", "PostgreSQL", "Redis"],
    image_urls: [],
    emoji: "🔧", link: "#",
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

const FALLBACK_CATEGORIES: ProjectCategoryRow[] = [
  { id: "1", slug: "software",     label: "Software",     order_index: 0, created_at: "" },
  { id: "2", slug: "uiux",         label: "UI/UX",        order_index: 1, created_at: "" },
  { id: "3", slug: "illustration", label: "Illustration", order_index: 2, created_at: "" },
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
  link: string;
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
    link: p.link,
  };
}

export default function WorksContent({ dbProjects, spotifyEmbedUrl, galleryItems = [], categories: categoriesProp }: { dbProjects?: Project[]; spotifyEmbedUrl?: string | null; galleryItems?: GalleryItem[]; categories?: ProjectCategoryRow[] }) {
  const [active, setActive] = useState<Category>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<ProjectRow | null>(null);

  const categories = categoriesProp?.length ? categoriesProp : FALLBACK_CATEGORIES;
  const filters = [
    { label: "All", value: "all" },
    ...categories.map((c) => ({ label: c.label, value: c.slug })),
  ];
  const categoryLabel = Object.fromEntries(filters.map((f) => [f.value, f.label]));

  const projects: ProjectRow[] = dbProjects?.length
    ? dbProjects.map(toRow)
    : staticProjects;

  const filtered = projects.filter((p) => active === "all" || p.category === active);

  const handleFilter = (val: Category) => {
    setActive(val);
    setOpenId(null);
  };

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

      {/* ── Projects accordion ── */}
      <section className="pt-6 md:pt-8 pb-16 md:pb-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Filter tabs */}
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFilter(f.value)}
                  className={`font-body font-semibold px-5 py-2 rounded-full transition-all cartoon-border text-sm whitespace-nowrap shrink-0 ${
                    active === f.value ? "bg-navy text-cream" : "bg-transparent text-ink hover:bg-yellow"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Accordion list */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const isOpen = openId === project.id;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="cartoon-border rounded-2xl overflow-hidden"
                  >
                    {/* Card header */}
                    <button
                      onClick={() => setOpenId(isOpen ? null : project.id)}
                      className={`card-surface w-full flex items-center gap-4 p-4 md:p-5 text-left ${project.color_class} ${project.text_color_class} transition-opacity hover:opacity-90`}
                    >
                      <span className="text-2xl md:text-3xl shrink-0 select-none flex items-center justify-center w-8 h-8">
                        {project.emoji ? <SkillIcon icon={project.emoji} className="w-7 h-7" /> : "✦"}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-extrabold text-base md:text-lg leading-tight truncate">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1.5 overflow-hidden max-h-6">
                          {project.tech_stack.map((t) => (
                            <span
                              key={t}
                              className="font-body text-[10px] md:text-xs font-semibold bg-black/15 px-2 py-0.5 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="cartoon-border-sm bg-black/10 font-body text-xs px-2 md:px-3 py-1 rounded-full capitalize shrink-0 hidden sm:block">
                        {categoryLabel[project.category] ?? project.category}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 font-display font-bold text-lg leading-none"
                      >
                        ↓
                      </motion.span>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className={`card-surface overflow-hidden ${project.color_class}`}
                        >
                          <div className={`px-5 pb-5 pt-3 border-t-2 border-black/10 ${project.text_color_class}`}>
                            {/* Screenshots carousel */}
                            <ProjectCarousel images={project.image_urls} title={project.title} />

                            <p className="font-body text-sm md:text-base opacity-80 leading-relaxed mb-4">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-5">
                              {project.tech_stack.map((t) => (
                                <span
                                  key={t}
                                  className="cartoon-border-sm bg-black/10 font-body font-semibold text-xs px-3 py-1.5 rounded-full"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setModalProject(project)}
                                className="inline-flex items-center gap-2 cartoon-border-sm bg-black/20 font-body font-semibold text-sm px-4 py-2 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                              >
                                View details
                              </button>
                              {project.link && project.link !== "#" && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 cartoon-border-sm bg-black/20 font-body font-semibold text-sm px-4 py-2 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                                >
                                  Live ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="font-body">No projects in this category yet.</p>
              </div>
            )}
          </div>
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
                  <div className="h-full w-full cartoon-border-light rounded-2xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform">
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery item"}
                      className="w-full h-full object-cover block"
                    />
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
        onClose={() => setModalProject(null)}
      />
    </main>
  );
}
