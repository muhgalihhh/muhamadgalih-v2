"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Users, X, FileText } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import TestimonialsSection from "@/components/sections/Testimonials";
import PdfPreviewModal from "@/components/works/PdfPreviewModal";
import type { Experience, Education, Skill, Certificate, Organization, Testimonial, ProjectLink } from "@/types/portfolio";

const staticExperience = [
  {
    id: "e1",
    role: "Full-Stack Engineer",
    company: "Freelance / Personal Projects",
    company_logo_url: null,
    company_logo_emoji: "⚡",
    period: "2023 · Present",
    start_date: "2023-01-01",
    end_date: null,
    color_class: "bg-violet",
    text_color_class: "text-cream",
    points: [
      "Built end-to-end web apps with Next.js, Supabase, and TypeScript",
      "Designed and implemented REST APIs with Node.js and PostgreSQL",
      "Delivered pixel-perfect UIs with Tailwind CSS and Framer Motion",
    ],
    images: [],
    order_index: 0,
    created_at: "",
  },
  {
    id: "e2",
    role: "UI/UX Designer",
    company: "Various Clients",
    company_logo_url: null,
    company_logo_emoji: "🎨",
    period: "2022 · 2023",
    start_date: "2022-01-01",
    end_date: "2023-12-31",
    color_class: "bg-coral",
    text_color_class: "text-cream",
    points: [
      "Crafted 40+ screen fintech mobile app UI in Figma",
      "Led brand identity design for an Indonesian startup",
      "Conducted user research and usability testing sessions",
    ],
    images: [],
    order_index: 1,
    created_at: "",
  },
  {
    id: "e3",
    role: "Freelance Illustrator",
    company: "Self-employed",
    company_logo_url: null,
    company_logo_emoji: "✏️",
    period: "2021 · Present",
    start_date: "2021-01-01",
    end_date: null,
    color_class: "bg-yellow",
    text_color_class: "text-ink",
    points: [
      "Created original character illustration series using Procreate",
      "Designed vector artwork with Adobe Illustrator for print and digital",
      "Produced motion graphics and animated illustrations",
    ],
    images: [],
    order_index: 2,
    created_at: "",
  },
];

const staticSkills = [
  { id: "k1", name: "React / Next.js", color_class: "bg-violet text-cream", category: "development" as const, icon: "", order_index: 0, created_at: "" },
  { id: "k2", name: "TypeScript",      color_class: "bg-sky text-ink",      category: "development" as const, icon: "", order_index: 1, created_at: "" },
  { id: "k3", name: "Node.js",         color_class: "bg-mint text-ink",     category: "development" as const, icon: "", order_index: 2, created_at: "" },
  { id: "k4", name: "Supabase",        color_class: "bg-coral text-cream",  category: "development" as const, icon: "", order_index: 3, created_at: "" },
  { id: "k5", name: "Figma",           color_class: "bg-pink text-ink",     category: "design" as const,      icon: "", order_index: 4, created_at: "" },
  { id: "k6", name: "Tailwind CSS",    color_class: "bg-yellow text-ink",   category: "development" as const, icon: "", order_index: 5, created_at: "" },
  { id: "k7", name: "Framer Motion",   color_class: "bg-coral text-cream",  category: "development" as const, icon: "", order_index: 6, created_at: "" },
  { id: "k8", name: "Illustration",    color_class: "bg-mint text-ink",     category: "design" as const,      icon: "", order_index: 7, created_at: "" },
  { id: "k9", name: "PostgreSQL",      color_class: "bg-sky text-ink",      category: "development" as const, icon: "", order_index: 8, created_at: "" },
  { id: "k10",name: "Procreate",       color_class: "bg-violet text-cream", category: "design" as const,      icon: "", order_index: 9, created_at: "" },
];

const staticEducation: Education[] = [
  { id: "e1", institution: "Universitas Jenderal Soedirman", degree: "B.Sc. Computer Science", institution_logo_url: null, institution_logo_emoji: "🎓", period: "2022 · Present", start_date: "2022-08-01", end_date: null, gpa: "3.78 / 4.00", color_class: "bg-sky", text_color_class: "text-ink", points: ["Thesis on topic modeling for research trend analysis, using BERTopic and a supporting interactive dashboard."], order_index: 0, created_at: "" },
];

const staticOrganizations: Organization[] = [
  { id: "o1", name: "Google Developer Student Club", role: "UI/UX Lead",       period: "2022 · 2023",    start_date: "2022-01-01", end_date: "2023-12-31", description: "Led UI/UX initiatives and workshops, mentoring members on design fundamentals.", images: [], icon: "LuRocket",  logo_url: null, color_class: "bg-sky",  text_color_class: "text-ink", order_index: 0, created_at: "" },
  { id: "o2", name: "University Design Club",        role: "Creative Director", period: "2021 · 2023",    start_date: "2021-01-01", end_date: "2023-12-31", description: "Directed the creative team and set the visual direction for campus events.", images: [], icon: "LuPalette", logo_url: null, color_class: "bg-mint", text_color_class: "text-ink", order_index: 1, created_at: "" },
  { id: "o3", name: "Open Source Community",         role: "Contributor",       period: "2022 · Present", start_date: "2022-01-01", end_date: null,         description: "Contributed code, docs, and design feedback to open-source projects.", images: [], icon: "LuCode",    logo_url: null, color_class: "bg-pink", text_color_class: "text-ink", order_index: 2, created_at: "" },
];

interface Props {
  dbExperiences?: Experience[];
  dbEducation?: Education[];
  dbSkills?: Skill[];
  dbCertificates?: Certificate[];
  dbOrganizations?: Organization[];
  testimonials?: Testimonial[];
  ownTestimonial?: Testimonial | null;
}

export default function AboutContent({ dbExperiences, dbEducation, dbSkills, dbCertificates, dbOrganizations, testimonials = [], ownTestimonial = null }: Props) {
  const experience: Experience[] = dbExperiences?.length ? dbExperiences : staticExperience;
  const education: Education[] = dbEducation?.length ? dbEducation : staticEducation;
  const skills: Skill[] = dbSkills?.length ? dbSkills : staticSkills;
  const certificates: Certificate[] = dbCertificates ?? [];
  const organizations: Organization[] = dbOrganizations?.length ? dbOrganizations : staticOrganizations;
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<ProjectLink | null>(null);

  return (
    <main className="md:pt-20">
      {/* ── Hero header ── */}
      <section className="py-20 md:py-28 bg-navy text-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="ABOUT ME"
            className="font-display font-extrabold text-cream text-[clamp(2rem,7vw,5.5rem)] leading-none mb-6"
          />
          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="w-20 h-1.5 bg-coral rounded-full mb-8" />
            <p className="font-body text-lg md:text-xl text-cream/75 max-w-2xl leading-relaxed">
              I&apos;m <strong className="text-cream font-bold">Muhamad Galih</strong>, also known as{" "}
              <strong className="text-coral font-bold">MIZARIE</strong>. Full-Stack Engineer,
              UI/UX Designer, Illustrator, and Data Scientist based in Indonesia. I bridge the gap
              between technical precision, data-driven thinking, and artistic creativity.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.35}>
            <p className="font-body text-base md:text-lg text-cream/60 max-w-2xl leading-relaxed mt-4">
              Whether it&apos;s architecting a scalable backend, crafting pixel-perfect interfaces,
              or drawing original characters, they all get pulled through the same filter:
              does this actually feel good to use?
            </p>
          </ScrollReveal>

          {/* Skill pills, grouped by category */}
          <div className="flex flex-col gap-6 mt-10">
            {[
              { label: "Development", items: skills.filter((s) => s.category === "development"), dot: "bg-mint" },
              { label: "Design",      items: skills.filter((s) => s.category === "design"),      dot: "bg-pink" },
            ].map(
              (group) =>
                group.items.length > 0 && (
                  <ScrollReveal key={group.label} variant="fade-up" delay={0.5}>
                    <span className="inline-flex items-center gap-2 font-display font-bold text-sm text-cream/50 mb-3">
                      <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((s, i) => (
                        <motion.span
                          key={s.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 + i * 0.04, duration: 0.4, ease: [0.22,1,0.36,1] }}
                          className={`card-surface ${s.color_class} font-body font-semibold px-3 py-1.5 rounded-full cartoon-border-sm text-xs md:text-sm hover:-translate-y-0.5 transition-transform inline-flex items-center gap-1.5`}
                        >
                          {s.icon && <SkillIcon icon={s.icon} className="w-4 h-4 shrink-0" />}{s.name}
                        </motion.span>
                      ))}
                    </div>
                  </ScrollReveal>
                )
            )}
          </div>
        </div>
      </section>

      {/* ── Work Experience ── */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="WORK EXPERIENCE"
            className="font-display font-extrabold text-ink text-[clamp(1.6rem,5vw,4rem)] mb-4 leading-none"
          />
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="w-16 h-1.5 bg-violet rounded-full mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-ink/10 hidden md:block" />

            <div className="flex flex-col gap-8 md:gap-10">
              {experience.map((exp, i) => (
                <ScrollReveal key={exp.id} variant="fade-up" delay={i * 0.12}>
                  <div className="md:pl-24 relative">
                    {/* Timeline dot — plain color circle */}
                    <div className={`card-surface hidden md:flex absolute left-4 top-6 w-8 h-8 rounded-full ${exp.color_class} cartoon-border-sm shrink-0`} />

                    <div className={`card-surface ${exp.color_class} cartoon-border rounded-2xl p-6 md:p-8 ${exp.text_color_class}`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          {/* Company logo / icon inside the card */}
                          {(exp.company_logo_url || exp.company_logo_emoji) && (
                            <div className="w-11 h-11 rounded-xl bg-cream/20 cartoon-border-sm flex items-center justify-center shrink-0 overflow-hidden">
                              {exp.company_logo_url
                                ? <img src={exp.company_logo_url} alt={exp.company} className="w-full h-full object-cover rounded-xl" />
                                : <SkillIcon icon={exp.company_logo_emoji} className="w-6 h-6" />
                              }
                            </div>
                          )}
                          <div>
                            <h3 className="font-display font-extrabold text-xl md:text-2xl leading-tight">
                              {exp.role}
                            </h3>
                            <p className="font-body font-semibold text-sm opacity-80 mt-0.5">
                              {exp.company}
                            </p>
                          </div>
                        </div>
                        <span className={`cartoon-border-sm bg-black/15 font-body font-semibold text-xs px-3 py-1.5 rounded-full shrink-0 self-start ${exp.text_color_class}`}>
                          {exp.period}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {exp.points.map((pt, j) => (
                          <li key={j} className="font-body text-sm opacity-75 flex items-start gap-2">
                            <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            {pt}
                          </li>
                        ))}
                      </ul>

                      {exp.images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-5">
                          {exp.images.map((url) => (
                            <button
                              key={url}
                              type="button"
                              onClick={() => setLightbox(url)}
                              className="aspect-square rounded-xl overflow-hidden cartoon-border-sm group/img"
                            >
                              <img
                                src={url}
                                alt={exp.company}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="EDUCATION"
            className="font-display font-extrabold text-ink text-[clamp(1.6rem,5vw,4rem)] mb-4 leading-none"
          />
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="w-16 h-1.5 bg-sky rounded-full mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-ink/10 hidden md:block" />

            <div className="flex flex-col gap-8 md:gap-10">
              {education.map((edu, i) => (
                <ScrollReveal key={edu.id} variant="fade-up" delay={i * 0.12}>
                  <div className="md:pl-24 relative">
                    <div className={`card-surface hidden md:flex absolute left-4 top-6 w-8 h-8 rounded-full ${edu.color_class} cartoon-border-sm shrink-0`} />

                    <div className={`card-surface ${edu.color_class} cartoon-border rounded-2xl p-6 md:p-8 ${edu.text_color_class}`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          {(edu.institution_logo_url || edu.institution_logo_emoji) && (
                            <div className="w-11 h-11 rounded-xl bg-cream/20 cartoon-border-sm flex items-center justify-center shrink-0 overflow-hidden">
                              {edu.institution_logo_url
                                ? <img src={edu.institution_logo_url} alt={edu.institution} className="w-full h-full object-cover rounded-xl" />
                                : <SkillIcon icon={edu.institution_logo_emoji} className="w-6 h-6" />
                              }
                            </div>
                          )}
                          <div>
                            <h3 className="font-display font-extrabold text-xl md:text-2xl leading-tight">
                              {edu.degree}
                            </h3>
                            <p className="font-body font-semibold text-sm opacity-80 mt-0.5">
                              {edu.institution}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                          <span className={`cartoon-border-sm bg-black/15 font-body font-semibold text-xs px-3 py-1.5 rounded-full ${edu.text_color_class}`}>
                            {edu.period}
                          </span>
                          {edu.gpa && (
                            <span className={`cartoon-border-sm bg-black/15 font-body font-semibold text-xs px-3 py-1.5 rounded-full ${edu.text_color_class}`}>
                              GPA {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {edu.points.map((pt, j) => (
                          <li key={j} className="font-body text-sm opacity-75 flex items-start gap-2">
                            <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Organizations ── */}
      <section className="py-20 md:py-28 bg-navy text-cream relative overflow-hidden">
        {/* Grid line texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="w-full h-full grid-pattern-lines-light" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="ORGANIZATIONS"
            className="font-display font-extrabold text-cream text-[clamp(1.6rem,5vw,4rem)] mb-4 leading-none"
          />
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="w-16 h-1.5 bg-mint rounded-full mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {organizations.map((org, i) => (
              <ScrollReveal key={org.id} variant="scale-in" delay={i * 0.1}>
                <button
                  type="button"
                  onClick={() => setActiveOrg(org)}
                  className={`card-surface ${org.color_class} ${org.text_color_class} cartoon-border rounded-2xl p-6 h-full w-full text-left cursor-pointer hover:-translate-y-1 transition-transform`}
                >
                  <div className="mb-4 flex items-center justify-center w-9 h-9">
                    {org.logo_url
                      ? <img src={org.logo_url} alt={org.name} className="w-9 h-9 object-contain rounded-md" />
                      : org.icon
                        ? <SkillIcon icon={org.icon} className="w-9 h-9" />
                        : <Users size={36} strokeWidth={1.5} />}
                  </div>
                  <h3 className="font-display font-extrabold text-lg leading-tight mb-1">
                    {org.name}
                  </h3>
                  <p className="font-body font-semibold text-sm opacity-70">{org.role}</p>
                  <p className="font-body text-xs opacity-50 mt-2">{org.period}</p>
                  {(org.description || org.images.length > 0) && (
                    <p className="font-body text-xs font-semibold opacity-60 mt-4 inline-flex items-center gap-1.5">
                      View details
                      {org.images.length > 0 && <span className="opacity-80">· {org.images.length} {org.images.length === 1 ? "photo" : "photos"}</span>}
                      <span>→</span>
                    </p>
                  )}
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificates — hidden entirely until there's something to show ── */}
      {certificates.length > 0 && (
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="CERTIFICATES"
            className="font-display font-extrabold text-ink text-[clamp(1.6rem,5vw,4rem)] mb-4 leading-none"
          />
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="w-16 h-1.5 bg-coral rounded-full mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {certificates.map((cert, i) => (
                <ScrollReveal key={cert.id} variant="scale-in" delay={i * 0.07}>
                  <div className="cartoon-border rounded-2xl overflow-hidden bg-cream group hover:-translate-y-1 transition-transform">
                    {cert.image_url && cert.image_url.toLowerCase().endsWith(".pdf") ? (
                      <button
                        type="button"
                        onClick={() => setPreviewCert({ label: cert.title, url: cert.image_url! })}
                        className="w-full h-36 bg-yellow flex items-center justify-center cursor-pointer"
                      >
                        <FileText size={44} strokeWidth={1.2} className="text-ink/40" />
                      </button>
                    ) : cert.image_url ? (
                      <div className="w-full h-36 overflow-hidden">
                        <img
                          src={cert.image_url}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-36 bg-yellow flex items-center justify-center">
                        <Award size={48} strokeWidth={1.2} className="text-ink/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-display font-extrabold text-ink text-sm leading-tight mb-1">
                        {cert.title}
                      </h3>
                      <p className="font-body font-semibold text-muted text-xs">{cert.issuer}</p>
                      {cert.issue_date && (
                        <p className="font-body text-muted/60 text-xs mt-0.5">
                          {new Date(cert.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                        </p>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 cartoon-border-sm bg-navy text-cream font-body font-semibold text-xs px-3 py-1.5 rounded-full hover:-translate-y-0.5 transition-transform"
                        >
                          View credential ↗
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>
      )}

      <TestimonialsSection testimonials={testimonials} ownTestimonial={ownTestimonial} />

      {/* ── Organization detail modal ── */}
      <AnimatePresence>
        {activeOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveOrg(null)}
            className="fixed inset-0 z-[500] bg-ink/50 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-lg bg-cream cartoon-border rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              {/* Header — uses the org's brand color */}
              <div className={`card-surface ${activeOrg.color_class} ${activeOrg.text_color_class} p-6 md:p-7 relative`}>
                <button
                  onClick={() => setActiveOrg(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
                <div className="mb-4 flex items-center justify-center w-12 h-12">
                  {activeOrg.logo_url
                    ? <img src={activeOrg.logo_url} alt={activeOrg.name} className="w-12 h-12 object-contain rounded-lg" />
                    : activeOrg.icon
                      ? <SkillIcon icon={activeOrg.icon} className="w-12 h-12" />
                      : <Users size={48} strokeWidth={1.5} />}
                </div>
                <h3 className="font-display font-extrabold text-2xl leading-tight pr-8">{activeOrg.name}</h3>
                <p className="font-body font-semibold text-sm opacity-80 mt-1">{activeOrg.role}</p>
                <p className="font-body text-xs opacity-60 mt-1">{activeOrg.period}</p>
              </div>
              {/* Body — description + gallery */}
              <div className="p-6 md:p-7">
                {activeOrg.description ? (
                  <p className="font-body text-ink/80 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {activeOrg.description}
                  </p>
                ) : (
                  <p className="font-body text-muted text-sm italic">No description yet.</p>
                )}

                {activeOrg.images.length > 0 && (
                  <div className="mt-6">
                    <p className="font-body text-[11px] tracking-[0.2em] uppercase font-semibold text-muted mb-3">
                      Gallery
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {activeOrg.images.map((url) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setLightbox(url)}
                          className="aspect-square rounded-xl overflow-hidden cartoon-border-sm group/img"
                        >
                          <img
                            src={url}
                            alt={activeOrg.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox (full photo) ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[600] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-cream flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-2xl object-contain cartoon-border-light"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <PdfPreviewModal link={previewCert} onClose={() => setPreviewCert(null)} />
    </main>
  );
}
