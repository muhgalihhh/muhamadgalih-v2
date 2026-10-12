import type { Metadata } from "next";
import Link from "next/link";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const metadata: Metadata = { title: "Page not found · MIZARIE" };

export default function NotFound() {
  return (
    <main className="md:pt-20 bg-cream min-h-[80vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines" />
      </div>
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
        <ScrollReveal variant="scale-in" once>
          <span className="inline-block cartoon-border bg-yellow text-ink font-display font-extrabold text-2xl md:text-3xl px-5 py-2 rounded-2xl -rotate-3 mb-8">
            404
          </span>
        </ScrollReveal>
        <AnimatedText
          as="h1"
          once
          text="THIS PAGE WANDERED OFF"
          className="font-display font-extrabold text-ink text-[clamp(2rem,6vw,4.5rem)] leading-none mb-6"
        />
        <ScrollReveal variant="fade-up" delay={0.2} once>
          <p className="font-body text-muted text-base md:text-lg max-w-xl mb-10">
            The link might be old, or the project got a new address. The work is still here though.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/works" className="cartoon-border bg-navy text-cream font-body font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform">
              See my works →
            </Link>
            <Link href="/" className="cartoon-border bg-cream text-ink font-body font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform">
              Back home
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
