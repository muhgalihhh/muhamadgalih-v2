"use client";

import Link from "next/link";
import { ArrowUp, Download, Mail } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { getSocials } from "@/lib/socials";
import type { Profile } from "@/types/portfolio";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/contact", label: "Contact" },
];

const linkCls = "font-body text-cream/70 hover:text-yellow transition-colors inline-flex items-center gap-2";

function Column({ title, delay, className, children }: { title: string; delay: number; className?: string; children: React.ReactNode }) {
  return (
    <ScrollReveal variant="fade-up" delay={delay} once className={className}>
      <p className="font-display font-bold text-xs uppercase tracking-[0.25em] text-cream/40 mb-4">{title}</p>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </ScrollReveal>
  );
}

export default function Footer({ profile }: { profile: Profile | null }) {
  const socials = getSocials(profile);
  const email = profile?.email || "galihslank79@gmail.com";

  return (
    // Mobile: bottom padding clears the fixed 72px bottom nav (+ iPhone safe area) with room to breathe.
    <footer className="bg-navy text-cream relative overflow-hidden pt-16 md:pt-20 pb-[calc(72px_+_env(safe-area-inset-bottom)_+_2.5rem)] md:pb-10">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines-light" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-8 gap-y-10">
          <ScrollReveal variant="fade-up" once className="col-span-2 md:col-span-1">
            <p className="font-display font-extrabold text-2xl md:text-3xl leading-none whitespace-nowrap">
              <span className="text-coral">MG</span> / MIZARIE
            </p>
            <p className="font-body text-cream/60 mt-4 max-w-xs leading-relaxed">
              {profile?.tagline || "Engineer by day, illustrator by night."}
            </p>
            {profile?.availability && (
              <span className="inline-flex items-center gap-2 mt-5 cartoon-border-sm bg-mint text-ink font-body text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
                Taking on new projects
              </span>
            )}
          </ScrollReveal>

          <Column title="Navigate" delay={0.1}>
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className={linkCls}>{n.label}</Link></li>
            ))}
          </Column>

          <Column title="Elsewhere" delay={0.15}>
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Icon size={14} /> {label}
                </a>
              </li>
            ))}
          </Column>

          <Column title="Say hi" delay={0.2} className="col-span-2 md:col-span-1">
            <li>
              <a href={`mailto:${email}`} className={`${linkCls} text-sm break-words`}>
                <Mail size={14} className="shrink-0" /> {email}
              </a>
            </li>
            {profile?.cv_url && (
              <li>
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Download size={14} /> Download CV
                </a>
              </li>
            )}
          </Column>
        </div>

        <div className="mt-14 pt-6 border-t-2 border-cream/10 flex flex-col-reverse md:flex-row gap-4 justify-between items-start md:items-center">
          <p className="font-body text-sm text-cream/50">
            © {new Date().getFullYear()} Muhamad Galih · MIZARIE
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-cream/80 hover:text-yellow transition-colors"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
