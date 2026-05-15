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
    { value: projectsCount,                    suffix: "+", label: "Projects Shipped", color: "text-coral"  },
    { value: profile?.years_experience ?? 3,   suffix: "+", label: "Years Experience", color: "text-yellow" },
    { value: profile?.clients_count    ?? 2,   suffix: "+", label: "Happy Clients",    color: "text-mint"   },
    { value: profile?.coffee_label     ?? "∞", suffix: "",  label: "Coffee Consumed",  color: "text-violet" },
  ];
}

const FALLBACK_SKILLS = [
  { name: "React / Next.js", color: "bg-violet text-cream" },
  { name: "TypeScript",      color: "bg-sky text-ink" },
  { name: "Node.js",         color: "bg-mint text-ink" },
  { name: "Supabase",        color: "bg-coral text-cream" },
  { name: "Figma",           color: "bg-pink text-ink" },
  { name: "Tailwind CSS",    color: "bg-yellow text-ink" },
  { name: "Framer Motion",   color: "bg-coral text-cream" },
  { name: "Illustration",    color: "bg-mint text-ink" },
  { name: "PostgreSQL",      color: "bg-sky text-ink" },
  { name: "Procreate",       color: "bg-violet text-cream" },
];

function CountUp({
  value,
  suffix,
  color,
}: {
  value: number | string;
  suffix: string;
  color: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
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
    <p ref={ref} className={`font-display font-extrabold ${color} text-[3.5rem] leading-none`}>
      {typeof value === "string" ? (
        <>{value}{suffix}</>
      ) : (
        <><motion.span>{rounded}</motion.span>{suffix}</>
      )}
    </p>
  );
}

const FALLBACK_BIO_1 = "I'm a passionate Full-Stack Engineer, UI/UX Designer, and Illustrator based in Indonesia. I love creating digital experiences that are both beautiful and functional. From writing clean backend code to crafting pixel-perfect interfaces and original artwork.";
const FALLBACK_BIO_2 = "Whether it's a web app, a brand identity, or an illustration series, I bring the same energy and attention to detail to every single project.";

export default function About({ profile, skills: skillsProp, projectsCount = 0 }: { profile?: Profile | null; skills?: Skill[]; projectsCount?: number }) {
  const displaySkills = skillsProp && skillsProp.length > 0
    ? skillsProp.map((s) => ({ name: s.name, color: s.color_class }))
    : FALLBACK_SKILLS;

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
          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} variant="scale-in" delay={i * 0.1}>
                <div className="cartoon-border-light rounded-2xl p-4 md:p-6 bg-white/5 hover:-translate-y-1 transition-transform">
                  <CountUp value={stat.value} suffix={stat.suffix} color={stat.color} />
                  <p className="font-body text-xs md:text-sm text-cream/60 mt-2 leading-snug">
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
              <div className="flex flex-wrap gap-2 md:gap-3">
                {displaySkills.map((skill, i) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
