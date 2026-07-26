"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Mail, Download } from "lucide-react";
import CyclingText from "@/components/animations/CyclingText";
import { handleAnchorClick } from "@/lib/smoothScroll";
import type { Profile } from "@/types/portfolio";

const DEFAULT_ROLES = ["Full-Stack Engineering", "UI/UX Design", "Illustration & Art", "Data Science & Analysis"];

const containerAnim = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const itemAnim = {
  hidden: { y: 32, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function Hero({ profile }: { profile?: Profile | null }) {
  const name             = profile?.name             ?? "MUHAMAD GALIH";
  const alias            = profile?.alias            ?? "MIZARIE";
  const isAvailable      = profile?.availability     ?? true;
  const avatarUrl        = profile?.avatar_url       ?? null;
  const illustrationUrl  = profile?.illustration_url ?? null;
  const cvUrl            = profile?.cv_url           ?? null;

  // Split name: first part(s) → solid ink, last word → yellow accent
  const nameParts  = name.trim().split(/\s+/);
  const firstNames = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : name;
  const lastName   = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const heroRoles = (profile?.hero_roles && profile.hero_roles.length > 0)
    ? profile.hero_roles
    : DEFAULT_ROLES;

  const sectionRef = useRef<HTMLElement>(null);
  const [artHovered, setArtHovered] = useState(false);

  // Which image is active: hover = illustration (if available), else real photo
  const activeImage = (artHovered && illustrationUrl) ? illustrationUrl : (avatarUrl ?? illustrationUrl);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yPhoto  = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen bg-cream relative overflow-x-hidden flex items-center pt-24 md:pt-20 pb-40 md:pb-20"
    >
      {/* Faint dot grid background */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        <motion.div
          className="flex flex-col gap-5 items-start"
          variants={containerAnim}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow: alias + availability */}
          <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-4">
            <span className="font-body text-sm md:text-base text-muted">
              a.k.a. <span className="font-display font-bold text-coral">{alias}</span>
            </span>
            {isAvailable && (
              <span className="inline-flex items-center cartoon-border-sm bg-mint px-3 py-1.5 rounded-lg -rotate-2">
                <span className="font-body font-semibold text-xs text-ink">
                  Taking on new projects
                </span>
              </span>
            )}
          </motion.div>

          {/* Name — the loudest element on the page, everything else stays quiet */}
          <motion.h1
            variants={itemAnim}
            className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-ink text-[clamp(2rem,9.5vw,7.5rem)]"
          >
            {lastName ? (
              <>
                <span className="block">{firstNames.toUpperCase()}</span>
                <span className="hero-name-accent block w-fit pr-3">{lastName.toUpperCase()}</span>
              </>
            ) : (
              <span className="hero-name-accent pr-3">{name.toUpperCase()}</span>
            )}
          </motion.h1>

          {/* Below the name: text left, photo right */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-10 items-center mt-2">
            <div className="flex flex-col gap-5 items-start">
              {/* Cycling role line */}
              <motion.div variants={itemAnim} className="flex items-center gap-2.5 flex-wrap">
                <span className="font-body text-muted text-lg md:text-2xl">I build</span>
                <CyclingText
                  texts={heroRoles}
                  className="font-display font-bold text-[clamp(1.25rem,3vw,2rem)] text-coral"
                />
              </motion.div>

              <motion.p
                variants={itemAnim}
                className="font-body text-muted text-base md:text-lg leading-relaxed max-w-md"
              >
                Engineer by day, illustrator by night. I make the web
                a little less boring.
              </motion.p>

              {/* CTAs: one primary, one secondary, CV as a plain link */}
              <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-3 md:gap-4 mt-3">
            <a
              href="#works"
              onClick={(e) => handleAnchorClick(e, "works")}
              className="cartoon-border bg-navy text-cream font-body font-semibold px-5 py-2.5 md:px-7 md:py-3.5 text-sm md:text-base rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform inline-flex items-center gap-2"
            >
              See my work
              <ArrowDown size={18} strokeWidth={2.5} />
            </a>
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "contact")}
              className="cartoon-border bg-cream text-ink font-body font-semibold px-5 py-2.5 md:px-7 md:py-3.5 text-sm md:text-base rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform inline-flex items-center gap-2"
            >
              Let&apos;s talk
              <Mail size={18} strokeWidth={2.5} />
            </a>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="font-body font-semibold text-sm md:text-base text-ink underline underline-offset-4 decoration-2 decoration-coral hover:decoration-ink transition-colors inline-flex items-center gap-1.5"
              >
                    <Download size={16} strokeWidth={2.5} />
                    Download CV
                  </a>
                )}
              </motion.div>
            </div>

            {/* ── Right: photo card — flips between real photo and illustration ── */}
            <motion.div
              style={{ y: yPhoto }}
              className="justify-self-center lg:justify-self-end lg:-mt-44 pr-2 pb-2"
            >
          <motion.div
            className="relative w-64 h-80 md:w-72 md:h-[22rem] lg:w-80 lg:h-[26rem] cursor-pointer select-none"
            initial={{ opacity: 0, scale: 0.9, rotate: 7 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 20 }}
            onHoverStart={() => setArtHovered(true)}
            onHoverEnd={() => setArtHovered(false)}
            onClick={() => setArtHovered((prev) => !prev)}
            whileHover={{ rotate: 0, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Offset backing — stacked-paper look */}
            <div
              aria-hidden
              className="absolute inset-0 bg-violet rounded-3xl border-2 border-ink translate-x-3 translate-y-3 rotate-2"
            />

            {/* Card */}
            <motion.div
              className="absolute inset-0 cartoon-border-lg rounded-3xl overflow-hidden flex items-center justify-center"
              animate={{ backgroundColor: artHovered ? "#fbbf24" : "#fef08a" }}
              transition={{ duration: 0.4 }}
            >
              {/* Avatar / Illustration — crossfade on hover */}
              {activeImage ? (
                <AnimatePresence mode="sync">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
              ) : (
                <span className="font-display font-extrabold text-[7rem] select-none leading-none text-ink opacity-10">
                  {name.charAt(0)}{lastName.charAt(0)}
                </span>
              )}

              {/* Label pill — "real me" idle, "illustrated" on hover */}
              {activeImage && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={artHovered ? "illus" : "real"}
                    className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur-sm cartoon-border-sm rounded-full px-2.5 py-1 pointer-events-none z-10"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="font-body text-[10px] font-bold text-cream tracking-wide uppercase">
                      {artHovered && illustrationUrl ? "illustrated" : "photo"}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Flip hint — only when illustration exists */}
              {illustrationUrl && (
                <AnimatePresence>
                  {!artHovered && (
                    <motion.div
                      className="absolute bottom-3 right-3 bg-coral cartoon-border-sm rounded-full px-3 py-1 pointer-events-none"
                      initial={{ opacity: 0, scale: 0, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 400 }}
                    >
                      <span className="font-body text-[10px] font-bold text-cream tracking-wide uppercase">
                        <span className="hidden lg:inline">hover to flip</span>
                        <span className="lg:hidden">tap to flip</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              </motion.div>
            </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted pointer-events-none"
        style={{ opacity: fadeOut }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-body text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-muted/50" />
      </motion.div>
    </section>
  );
}
