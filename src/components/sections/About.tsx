"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Profile, Skill } from "@/types/portfolio";

function buildStats(profile?: Profile | null, projectsCount = 0) {
  return [
    { value: projectsCount,                    suffix: "+", label: "Projects shipped" },
    { value: profile?.years_experience ?? 3,   suffix: "+", label: "Years across code & canvas" },
    { value: profile?.clients_count    ?? 2,   suffix: "+", label: "Clients who came back" },
    { value: profile?.coffee_label     ?? "∞", suffix: "",  label: "Cups of coffee, uncounted" },
  ];
}

const FALLBACK_SKILLS = [
  { name: "React / Next.js", color: "bg-violet text-cream", category: "development" as const },
  { name: "TypeScript",      color: "bg-sky text-ink",      category: "development" as const },
  { name: "Node.js",         color: "bg-mint text-ink",     category: "development" as const },
  { name: "Supabase",        color: "bg-coral text-cream",  category: "development" as const },
  { name: "Figma",           color: "bg-pink text-ink",     category: "design" as const },
  { name: "Tailwind CSS",    color: "bg-yellow text-ink",   category: "development" as const },
  { name: "Framer Motion",   color: "bg-coral text-cream",  category: "development" as const },
  { name: "Illustration",    color: "bg-mint text-ink",     category: "design" as const },
  { name: "PostgreSQL",      color: "bg-sky text-ink",      category: "development" as const },
  { name: "Procreate",       color: "bg-violet text-cream", category: "design" as const },
];

function CountUp({ value, suffix }: { value: number | string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (typeof value !== "number") return;
    if (isInView) {
      animate(motionVal, value, { duration: 1.4, ease: "easeOut" });
    } else {
      animate(motionVal, 0, { duration: 0 });
    }
  }, [isInView, value, motionVal]);

  return (
    <span ref={ref} className="font-display font-extrabold text-cream text-2xl md:text-[1.75rem] leading-none tabular-nums">
      {typeof value === "string" ? (
        <>{value}{suffix}</>
      ) : (
        <><motion.span>{rounded}</motion.span>{suffix}</>
      )}
    </span>
  );
}

const FALLBACK_BIO_1 = "Fluent in two very different codebases: React components by day, ink and gradients by night. I've spent the last few years shipping full-stack products end to end, then unwinding by drawing the characters that end up as their mascots.";
const FALLBACK_BIO_2 = "Most of my work starts as a sketch, whether it's the interface or the illustration. If it needs building and it needs to look good doing it, that's the kind of project I want.";

export default function About({ profile, skills: skillsProp, projectsCount = 0 }: { profile?: Profile | null; skills?: Skill[]; projectsCount?: number }) {
  const displaySkills = skillsProp && skillsProp.length > 0
    ? skillsProp.map((s) => ({ name: s.name, color: s.color_class, category: s.category }))
    : FALLBACK_SKILLS;
  const developmentSkills = displaySkills.filter((s) => s.category === "development");
  const designSkills = displaySkills.filter((s) => s.category === "design");

  const bio = profile?.bio ?? null;
  const stats = buildStats(profile, projectsCount);

  return (
    <section id="about" className="py-20 md:py-32 bg-navy text-cream relative overflow-hidden">
      {/* Grid line texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines-light" />
      </div>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        {/* Heading */}
        <AnimatedText
          text="ABOUT ME"
          className="font-display font-extrabold text-cream text-[clamp(1.6rem,5.5vw,4.5rem)] mb-4 leading-none"
        />
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="w-16 h-1.5 bg-coral rounded-full mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* ── Stats — a colophon, not a dashboard ── */}
          <div className="border-l-2 border-cream/20 pl-5 md:pl-7 flex flex-col">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} variant="fade-left" delay={i * 0.08}>
                <div className="flex items-baseline gap-4 py-3 md:py-3.5 border-b border-cream/10 last:border-0">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                  <p className="font-body text-xs md:text-sm text-cream/55 leading-snug">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* ── Bio + Skills ── */}
          <div className="flex flex-col gap-8">
            <ScrollReveal variant="fade-left" delay={0.15}>
              {bio ? (
                <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
                  {bio}
                </p>
              ) : (
                <>
                  <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
                    {FALLBACK_BIO_1}
                  </p>
                  <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed mt-4">
                    {FALLBACK_BIO_2}
                  </p>
                </>
              )}
            </ScrollReveal>

            {/* Skills */}
            <div>
              <ScrollReveal variant="fade-up" delay={0.25}>
                <h3 className="font-display font-bold text-cream text-xl mb-4">
                  Skills &amp; Tools
                </h3>
              </ScrollReveal>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Development", items: developmentSkills, dot: "bg-mint" },
                  { label: "Design",      items: designSkills,      dot: "bg-pink" },
                ].map(
                  (group) =>
                    group.items.length > 0 && (
                      <div key={group.label}>
                        <span className="inline-flex items-center gap-2 font-display font-bold text-sm text-cream/50 mb-2.5">
                          <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                          {group.label}
                        </span>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {group.items.map((skill, i) => (
                            <ScrollReveal key={skill.name} variant="scale-in" delay={0.3 + i * 0.05}>
                              <span
                                className={`${skill.color} font-body font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full cartoon-border-sm text-xs md:text-sm hover:-translate-y-0.5 transition-transform inline-block`}
                              >
                                {skill.name}
                              </span>
                            </ScrollReveal>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
