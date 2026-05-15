"use client";

import { motion } from "framer-motion";
import { Rocket, Palette, Code2, Award } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import TestimonialsSection from "@/components/sections/Testimonials";
import type { Experience, Skill, Certificate, Testimonial } from "@/types/portfolio";

const staticExperience = [
  {
    id: "e1",
    role: "Full-Stack Engineer",
    company: "Freelance / Personal Projects",
    company_logo_url: null,
    company_logo_emoji: "⚡",
    period: "2023 · Present",
    color_class: "bg-violet",
    text_color_class: "text-cream",
    points: [
      "Built end-to-end web apps with Next.js, Supabase, and TypeScript",
      "Designed and implemented REST APIs with Node.js and PostgreSQL",
      "Delivered pixel-perfect UIs with Tailwind CSS and Framer Motion",
    ],
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
    color_class: "bg-coral",
    text_color_class: "text-cream",
    points: [
      "Crafted 40+ screen fintech mobile app UI in Figma",
      "Led brand identity design for an Indonesian startup",
      "Conducted user research and usability testing sessions",
    ],
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
    color_class: "bg-yellow",
    text_color_class: "text-ink",
    points: [
      "Created original character illustration series using Procreate",
      "Designed vector artwork with Adobe Illustrator for print and digital",
      "Produced motion graphics and animated illustrations",
    ],
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

const organizations = [
  { name: "Google Developer Student Club", role: "UI/UX Lead",       period: "2022 · 2023",    color: "bg-sky",  Icon: Rocket },
  { name: "University Design Club",        role: "Creative Director", period: "2021 · 2023",    color: "bg-mint", Icon: Palette },
  { name: "Open Source Community",         role: "Contributor",       period: "2022 · Present", color: "bg-pink", Icon: Code2 },
];

interface Props {
  dbExperiences?: Experience[];
  dbSkills?: Skill[];
  dbCertificates?: Certificate[];
  testimonials?: Testimonial[];
  ownTestimonial?: Testimonial | null;
}

export default function AboutContent({ dbExperiences, dbSkills, dbCertificates, testimonials = [], ownTestimonial = null }: Props) {
  const experience: Experience[] = dbExperiences?.length ? dbExperiences : staticExperience;
  const skills: Skill[] = dbSkills?.length ? dbSkills : staticSkills;
  const certificates: Certificate[] = dbCertificates ?? [];

  return (
    <main className="md:pt-20">
      {/* ── Hero header ── */}
      <section className="py-20 md:py-28 bg-navy text-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="ABOUT ME ✦"
            className="font-display font-extrabold text-cream text-[clamp(2rem,7vw,5.5rem)] leading-none mb-6"
          />
          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="w-20 h-1.5 bg-coral rounded-full mb-8" />
            <p className="font-body text-lg md:text-xl text-cream/75 max-w-2xl leading-relaxed">
              I&apos;m <strong className="text-cream font-bold">Muhamad Galih</strong>, also known as{" "}
              <strong className="text-coral font-bold">MIZARIE</strong>. Full-Stack Engineer,
              UI/UX Designer, and Illustrator based in Indonesia. I bridge the gap between
              technical precision and artistic creativity.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.35}>
            <p className="font-body text-base md:text-lg text-cream/60 max-w-2xl leading-relaxed mt-4">
              Whether it&apos;s architecting a scalable backend, crafting pixel-perfect interfaces,
              or drawing original characters. I bring the same obsessive attention to detail
              to every single project. Always learning, always building.
            </p>
          </ScrollReveal>

          {/* Skill pills */}
          <ScrollReveal variant="fade-up" delay={0.5}>
            <div className="flex flex-wrap gap-2 mt-10">
              {skills.map((s, i) => (
                <motion.span
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.04, duration: 0.4, ease: [0.22,1,0.36,1] }}
                  className={`${s.color_class} font-body font-semibold px-3 py-1.5 rounded-full cartoon-border-sm text-xs md:text-sm hover:-translate-y-0.5 transition-transform inline-flex items-center gap-1.5`}
                >
                  {s.icon && <SkillIcon icon={s.icon} className="w-4 h-4 shrink-0" />}{s.name}
                </motion.span>
              ))}
            </div>
          </ScrollReveal>
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
                    <div className={`hidden md:flex absolute left-4 top-6 w-8 h-8 rounded-full ${exp.color_class} cartoon-border-sm shrink-0`} />

                    <div className={`${exp.color_class} cartoon-border rounded-2xl p-6 md:p-8 ${exp.text_color_class}`}>
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
                            <span className="shrink-0 mt-0.5 text-base leading-none">✦</span>
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
              <ScrollReveal key={org.name} variant="scale-in" delay={i * 0.1}>
                <div className={`${org.color} cartoon-border rounded-2xl p-6 text-ink h-full`}>
                  <org.Icon size={36} className="mb-4" strokeWidth={1.5} />
                  <h3 className="font-display font-extrabold text-lg leading-tight mb-1">
                    {org.name}
                  </h3>
                  <p className="font-body font-semibold text-sm opacity-70">{org.role}</p>
                  <p className="font-body text-xs opacity-50 mt-2">{org.period}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificates ── */}
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

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {certificates.map((cert, i) => (
                <ScrollReveal key={cert.id} variant="scale-in" delay={i * 0.07}>
                  <div className="cartoon-border rounded-2xl overflow-hidden bg-cream group hover:-translate-y-1 transition-transform">
                    {cert.image_url ? (
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
                          View Credential ↗
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal variant="fade-up" delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="cartoon-border rounded-2xl overflow-hidden opacity-30"
                  >
                    <div className="w-full h-36 bg-yellow flex items-center justify-center">
                      <Award size={48} strokeWidth={1.2} className="text-ink/40" />
                    </div>
                    <div className="p-4 bg-cream">
                      <div className="h-3 w-3/4 bg-ink/10 rounded-full mb-2" />
                      <div className="h-2.5 w-1/2 bg-ink/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-body text-muted/50 text-sm text-center mt-8">
                Certificates will appear here once added via the admin dashboard.
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} ownTestimonial={ownTestimonial} />
    </main>
  );
}
