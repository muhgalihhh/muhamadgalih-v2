"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Palette, Network, Camera, MapPin, Clock, Briefcase, Loader2, Send, CheckCircle } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SpotifyCard from "@/components/ui/SpotifyCard";
import type { Profile } from "@/types/portfolio";

type FormState = "idle" | "loading" | "success" | "error";

function getSocials(profile: Profile | null) {
  const raw = [
    { label: "GitHub",    href: profile?.github_url    || "https://github.com/muhgalihhh", color: "bg-navy text-cream",  Icon: Code2   },
    { label: "Dribbble",  href: profile?.dribbble_url  || "#",                              color: "bg-pink text-ink",    Icon: Palette },
    { label: "LinkedIn",  href: profile?.linkedin_url  || "#",                              color: "bg-sky text-ink",     Icon: Network },
    { label: "Instagram", href: profile?.instagram_url || "#",                              color: "bg-coral text-cream", Icon: Camera  },
  ];
  return raw.filter((s) => s.href !== "#");
}

export default function ContactContent({ profile }: { profile?: Profile | null }) {
  const email = profile?.email || "galihslank79@gmail.com";
  const location = profile?.location || "Indonesia";
  const socials = getSocials(profile ?? null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    // Simulate send; replace with actual email/Supabase action
    await new Promise((r) => setTimeout(r, 1400));
    setFormState("success");
  };

  return (
    <main className="md:pt-20">
      {/* ── Hero header ── */}
      <section className="py-20 md:py-28 bg-yellow relative overflow-hidden">
        {/* Grid line texture */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="w-full h-full grid-pattern-lines" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <AnimatedText
            text="LET'S CREATE SOMETHING COOL ✦"
            className="font-display font-extrabold text-ink text-[clamp(1.6rem,5.5vw,4.5rem)] leading-tight mb-6 max-w-3xl"
            staggerDelay={0.03}
          />
          <ScrollReveal variant="fade-up" delay={0.25}>
            <div className="w-20 h-1.5 bg-ink rounded-full mb-6" />
            <p className="font-body text-ink/70 text-lg max-w-xl">
              Have a project in mind, want to collaborate, or just say hi? My inbox is always open.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        {/* Grid line texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full grid-pattern-lines" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start relative z-10">

          {/* Left: info */}
          <div>
            <ScrollReveal variant="fade-left" delay={0.1}>
              <h2 className="font-display font-extrabold text-ink text-2xl md:text-3xl mb-6">
                Get in touch
              </h2>
              <a
                href={`mailto:${email}`}
                className="font-display font-bold text-ink hover:text-coral transition-colors text-xl md:text-2xl block mb-8 underline underline-offset-4 decoration-2 decoration-ink/30 hover:decoration-coral w-fit"
              >
                {email} ↗
              </a>

              <div className="flex flex-col gap-3 mb-10">
                <div className="flex items-center gap-3 font-body text-ink/70 text-sm">
                  <MapPin size={16} className="shrink-0 text-coral" />
                  {location}
                </div>
                <div className="flex items-center gap-3 font-body text-ink/70 text-sm">
                  <Clock size={16} className="shrink-0 text-coral" />
                  WIB (UTC+7), usually responds within 24h
                </div>
                <div className="flex items-center gap-3 font-body text-ink/70 text-sm">
                  <Briefcase size={16} className="shrink-0 text-coral" />
                  Open for freelance & full-time opportunities
                </div>
              </div>

              <h3 className="font-display font-bold text-ink text-lg mb-4">Find me on</h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.color} cartoon-border font-body font-semibold px-4 py-2 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm flex items-center gap-2`}
                  >
                    <s.Icon size={14} />
                    {s.label}
                  </a>
                ))}
              </div>

              {profile?.spotify_embed_url && (
                <SpotifyCard embedUrl={profile.spotify_embed_url} />
              )}
            </ScrollReveal>
          </div>

          {/* Right: contact form */}
          <ScrollReveal variant="fade-right" delay={0.2}>
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="cartoon-border bg-mint rounded-2xl p-8 md:p-10 text-ink text-center"
                >
                  <CheckCircle size={56} className="mx-auto mb-4 text-ink" strokeWidth={1.5} />
                  <h3 className="font-display font-extrabold text-2xl mb-2">Message sent!</h3>
                  <p className="font-body text-ink/70">I&apos;ll get back to you as soon as possible. Thanks for reaching out!</p>
                  <button
                    onClick={() => { setFormState("idle"); setFields({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 cartoon-border bg-ink text-cream font-body font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform"
                  >
                    Send another ✦
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="cartoon-border bg-cream rounded-2xl p-6 md:p-8 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body font-semibold text-ink text-sm">Name</label>
                      <input
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="cartoon-border-sm rounded-xl px-4 py-3 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body font-semibold text-ink text-sm">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={fields.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="cartoon-border-sm rounded-xl px-4 py-3 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-semibold text-ink text-sm">Subject</label>
                    <input
                      name="subject"
                      value={fields.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="cartoon-border-sm rounded-xl px-4 py-3 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-semibold text-ink text-sm">Message</label>
                    <textarea
                      name="message"
                      value={fields.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project or idea..."
                      className="cartoon-border-sm rounded-xl px-4 py-3 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={formState === "loading"}
                    className="cartoon-border bg-navy text-cream font-body font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform self-start flex items-center gap-2 disabled:opacity-60"
                    whileTap={{ scale: 0.96 }}
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 bg-cream border-t-2 border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-body text-sm text-muted">
            © 2025 Muhamad Galih · MIZARIE · All rights reserved
          </p>
          <p className="font-display font-extrabold text-ink/20 text-2xl">
            MG / MIZARIE
          </p>
        </div>
      </footer>
    </main>
  );
}
