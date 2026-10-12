"use client";

import { Download } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Profile } from "@/types/portfolio";
import { getSocials } from "@/lib/socials";

export default function Contact({ profile }: { profile?: Profile | null }) {
  const email = profile?.email || "galihslank79@gmail.com";
  const socials = getSocials(profile ?? null);
  const cvUrl = profile?.cv_url ?? null;

  return (
    <section id="contact" className="pt-24 pb-[calc(72px_+_env(safe-area-inset-bottom)_+_2.5rem)] md:py-32 bg-yellow relative overflow-hidden">
      {/* Grid line texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines" />
      </div>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        <AnimatedText as="h2"
          text="LET'S CREATE SOMETHING COOL"
          className="font-display font-extrabold text-ink text-[clamp(1.5rem,5vw,4.2rem)] leading-tight mb-8 max-w-3xl"
          staggerDelay={0.035}
        />

        <ScrollReveal variant="fade-up" delay={0.2}>
          <p className="font-body text-lg text-ink/70 mb-8 max-w-xl">
            Have a project in mind, want to collaborate, or just want to say hi?
            My inbox is always open.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.3}>
          <a
            href={`mailto:${email}`}
            className="font-display font-bold text-ink hover:text-coral transition-colors text-[clamp(1rem,2.8vw,1.8rem)] block mb-10 underline underline-offset-4 decoration-2 decoration-ink/40 hover:decoration-coral w-fit"
          >
            {email} ↗
          </a>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.4}>
          <div className="flex flex-wrap gap-4 mb-20">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} cartoon-border font-body font-semibold px-5 py-2.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm flex items-center gap-2`}
              >
                <social.Icon size={15} />
                {social.label}
              </a>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-mint text-ink cartoon-border font-body font-semibold px-5 py-2.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm inline-flex items-center gap-2"
              >
                Download CV
                <Download size={16} strokeWidth={2.5} />
              </a>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.5}>
          <div className="pt-8 border-t-2 border-ink/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-body text-sm text-ink/50">
              © {new Date().getFullYear()} Muhamad Galih · MIZARIE · All rights reserved
            </p>
            <p className="font-display font-extrabold text-ink/30 text-2xl">
              MG / MIZARIE
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
