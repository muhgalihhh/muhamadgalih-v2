"use client";

import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Skill } from "@/types/portfolio";

const staticDesign = [
  { id: "d1", name: "Figma",             color_class: "bg-violet text-cream", icon: "🎨", category: "design" as const, order_index: 0, created_at: "" },
  { id: "d2", name: "Procreate",         color_class: "bg-pink text-ink",     icon: "✏️", category: "design" as const, order_index: 1, created_at: "" },
  { id: "d3", name: "Adobe Illustrator", color_class: "bg-coral text-cream",  icon: "🖊️", category: "design" as const, order_index: 2, created_at: "" },
  { id: "d4", name: "Adobe Photoshop",   color_class: "bg-sky text-ink",      icon: "🖼️", category: "design" as const, order_index: 3, created_at: "" },
  { id: "d5", name: "After Effects",     color_class: "bg-mint text-ink",     icon: "🎬", category: "design" as const, order_index: 4, created_at: "" },
  { id: "d6", name: "Framer",            color_class: "bg-yellow text-ink",   icon: "⚡", category: "design" as const, order_index: 5, created_at: "" },
];

const staticDev = [
  { id: "v1", name: "React",         color_class: "bg-sky text-ink",      icon: "⚛️", category: "development" as const, order_index: 0, created_at: "" },
  { id: "v2", name: "Next.js",       color_class: "bg-ink text-cream",    icon: "▲",  category: "development" as const, order_index: 1, created_at: "" },
  { id: "v3", name: "TypeScript",    color_class: "bg-sky text-ink",      icon: "🔷", category: "development" as const, order_index: 2, created_at: "" },
  { id: "v4", name: "Node.js",       color_class: "bg-mint text-ink",     icon: "🟢", category: "development" as const, order_index: 3, created_at: "" },
  { id: "v5", name: "Tailwind CSS",  color_class: "bg-sky text-ink",      icon: "💨", category: "development" as const, order_index: 4, created_at: "" },
  { id: "v6", name: "Supabase",      color_class: "bg-mint text-ink",     icon: "⚡", category: "development" as const, order_index: 5, created_at: "" },
  { id: "v7", name: "PostgreSQL",    color_class: "bg-violet text-cream", icon: "🐘", category: "development" as const, order_index: 6, created_at: "" },
  { id: "v8", name: "Framer Motion", color_class: "bg-coral text-cream",  icon: "🎭", category: "development" as const, order_index: 7, created_at: "" },
];

function ToolPill({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <ScrollReveal variant="scale-in" delay={delay}>
      <div className={`card-surface ${skill.color_class} cartoon-border-sm rounded-xl px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 hover:-translate-y-0.5 transition-transform cursor-default`}>
        {skill.icon && <SkillIcon icon={skill.icon} className="w-5 h-5" />}
        <span className="font-body font-semibold text-xs md:text-sm whitespace-nowrap">{skill.name}</span>
      </div>
    </ScrollReveal>
  );
}

export default function Technologies({ skills }: { skills?: Skill[] }) {
  const hasDB = skills && skills.length > 0;

  const designSkills = hasDB
    ? skills.filter((s) => s.category === "design")
    : staticDesign;

  const devSkills = hasDB
    ? skills.filter((s) => s.category === "development")
    : staticDev;

  return (
    <section id="technologies" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(#0D0B1E 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        <AnimatedText
          text="TOOLS & TECH"
          className="font-display font-extrabold text-ink text-[clamp(1.6rem,5.5vw,4.5rem)] mb-4 leading-none"
        />
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="w-16 h-1.5 bg-mint rounded-full mb-4" />
          <p className="font-body text-muted text-base md:text-lg mb-12 md:mb-16 max-w-xl">
            The tools and technologies I use to bring ideas to life, from wireframe to production.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Design */}
          {designSkills.length > 0 && (
            <ScrollReveal variant="fade-left" delay={0.15}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-violet cartoon-border-sm rounded-lg flex items-center justify-center text-cream text-sm font-bold">D</div>
                  <h3 className="font-display font-bold text-ink text-xl">Design & Creative</h3>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {designSkills.map((s, i) => <ToolPill key={s.id} skill={s} delay={0.2 + i * 0.04} />)}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Development */}
          {devSkills.length > 0 && (
            <ScrollReveal variant="fade-right" delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-sky cartoon-border-sm rounded-lg flex items-center justify-center text-ink text-sm font-bold">{"</>"}</div>
                  <h3 className="font-display font-bold text-ink text-xl">Development</h3>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {devSkills.map((s, i) => <ToolPill key={s.id} skill={s} delay={0.25 + i * 0.04} />)}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
