"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import CyclingText from "@/components/animations/CyclingText";
import type { Profile } from "@/types/portfolio";

const DEFAULT_ROLES = ["Full-Stack Engineering", "UI/UX Design", "Illustration & Art"];

const PILL_PALETTE = [
  { color: "bg-violet text-cream", rotation: "-2deg" },
  { color: "bg-mint text-ink",     rotation: "1.5deg" },
  { color: "bg-coral text-cream",  rotation: "-1deg" },
  { color: "bg-sky text-ink",      rotation: "2deg" },
  { color: "bg-pink text-ink",     rotation: "-1.5deg" },
  { color: "bg-yellow text-ink",   rotation: "1deg" },
];

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

const burstItems = [
  { color: "bg-coral",  size: "w-4 h-4",   shape: "rounded-full",   style: { top: "-12%", left: "18%" },  delay: 0,    floatY: -12 },
  { color: "bg-violet", size: "w-5 h-5",   shape: "rounded-sm",     style: { top: "10%",  right: "-12%" }, delay: 0.05, floatY: -10 },
  { color: "bg-mint",   size: "w-3 h-3",   shape: "rounded-full",   style: { bottom: "12%", right: "-10%" }, delay: 0.08, floatY: -8 },
  { color: "bg-sky",    size: "w-4 h-4",   shape: "rotate-45",      style: { bottom: "-8%", left: "28%" },  delay: 0.06, floatY: -10 },
  { color: "bg-yellow", size: "w-3 h-3",   shape: "rounded-full",   style: { top: "40%",  left: "-10%" },  delay: 0.1,  floatY: -6  },
  { color: "bg-pink",   size: "w-2.5 h-2.5", shape: "rounded-sm",  style: { top: "68%",  right: "-8%" },  delay: 0.04, floatY: -8  },
];

export default function Hero({ profile }: { profile?: Profile | null }) {
  const name             = profile?.name             ?? "MUHAMAD GALIH";
  const alias            = profile?.alias            ?? "MIZARIE";
  const isAvailable      = profile?.availability     ?? true;
  const avatarUrl        = profile?.avatar_url       ?? null;
  const illustrationUrl  = profile?.illustration_url ?? null;

  // Split name: first part(s) → stroke text, last word → sticker box
  const nameParts  = name.trim().split(/\s+/);
  const firstNames = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : name;
  const lastName   = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  // Hero roles — from DB or fallback. Used for both cycling text and role pills.
  const heroRoles = (profile?.hero_roles && profile.hero_roles.length > 0)
    ? profile.hero_roles
    : DEFAULT_ROLES;
  const rolePills = heroRoles.map((label, i) => ({
    label,
    color:    PILL_PALETTE[i % PILL_PALETTE.length].color,
    rotation: PILL_PALETTE[i % PILL_PALETTE.length].rotation,
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const [artHovered, setArtHovered] = useState(false);

  // Which image is active: hover = illustration (if available), else real photo
  const activeImage = (artHovered && illustrationUrl) ? illustrationUrl : (avatarUrl ?? illustrationUrl);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers — different speeds
  const yFast   = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const ySlow   = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const ySlowest = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen bg-cream relative overflow-hidden flex items-center md:pt-20 pb-40 md:pb-20"
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

      {/* ── Parallax design-themed decorators ── */}

      {/* 1. Code Card — fast layer, top-left */}
      <motion.div
        className="absolute pointer-events-none select-none hidden xl:block"
        style={{ y: yFast, left: "2%", top: "14%", opacity: fadeOut }}
      >
        <motion.div
          className="bg-navy cartoon-border-sm rounded-xl p-3 w-48 font-mono text-[11px] leading-relaxed"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-violet">const</span>{" "}
          <span className="text-sky">create</span>
          <span className="text-cream"> = () </span>
          <span className="text-yellow">=&gt;</span>
          <span className="text-cream"> {"{"}</span>
          <br />
          <span className="text-cream pl-3">  </span>
          <span className="text-mint">return</span>{" "}
          <span className="text-coral">&quot;awesome&quot;</span>
          <span className="text-cream">;</span>
          <br />
          <span className="text-cream">{"}"}</span>
        </motion.div>
      </motion.div>

      {/* 2. Color Palette — slow layer, top-right */}
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ y: ySlow, right: "3%", top: "12%", opacity: fadeOut }}
      >
        <motion.div
          className="bg-cream cartoon-border-sm rounded-xl px-3 py-2 flex flex-col gap-1.5"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <span className="font-body text-[9px] font-semibold text-muted tracking-widest uppercase">
            Palette
          </span>
          <div className="flex gap-1.5">
            {["bg-coral","bg-violet","bg-mint","bg-sky","bg-yellow","bg-pink"].map((c) => (
              <div key={c} className={`${c} w-5 h-5 rounded-full cartoon-border-sm`} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Figma-style frame — slowest layer, bottom-left */}
      <motion.div
        className="absolute pointer-events-none select-none hidden xl:block"
        style={{ y: ySlowest, left: "2%", bottom: "20%" }}
      >
        <motion.div
          className="relative w-24 h-24"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        >
          <div className="absolute inset-0 border-2 border-ink bg-transparent">
            {/* Corner resize handles */}
            {["-top-1.5 -left-1.5", "-top-1.5 -right-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-3 h-3 bg-sky border-2 border-ink`} />
            ))}
            {/* Inner content mockup */}
            <div className="m-2 border border-dashed border-ink/40 h-[calc(100%-1rem)] flex flex-col gap-1 p-1">
              <div className="bg-mint/30 h-2 rounded-sm w-full" />
              <div className="bg-violet/20 flex-1 rounded-sm" />
            </div>
          </div>
          {/* Label */}
          <div className="absolute -bottom-6 left-0 right-0 text-center font-mono text-[9px] text-muted">
            frame/hero
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Cursor SVG — fast layer, mid-right */}
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ y: yFast, right: "5%", top: "45%", opacity: fadeOut }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="relative text-ink">
            <svg width="36" height="40" viewBox="0 0 24 28" fill="none">
              <path
                d="M5 1 L5 22 L9 17 L13 25 L15.5 24 L11.5 16 L17 16 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
            {/* Click ripple */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-coral rounded-full cartoon-border-sm flex items-center justify-center">
              <span className="text-[8px] text-cream font-bold">↖</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 5. Component Card — slow layer, bottom-right */}
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ y: ySlow, right: "2%", bottom: "18%", opacity: fadeOut }}
      >
        <motion.div
          className="bg-cream cartoon-border-sm rounded-xl p-3 w-40"
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <p className="font-mono text-[8px] text-muted mb-2 tracking-wider">COMPONENT</p>
          <div className="bg-violet text-cream rounded-full text-[10px] text-center py-1.5 px-3 font-semibold cartoon-border-sm mb-2">
            Button
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-ink/10 rounded-full w-full" />
            <div className="h-1.5 bg-ink/10 rounded-full w-2/3" />
          </div>
        </motion.div>
      </motion.div>

      {/* 6. Grid/layout dots — slowest, scattered */}
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ y: ySlowest, right: "20%", top: "8%", opacity: fadeOut }}
      >
        <motion.div
          className="grid grid-cols-4 gap-2 opacity-30"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-ink rounded-full" />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 lg:gap-16 items-center relative z-10">

        {/* ── Left: Text ── */}
        <motion.div
          className="flex flex-col gap-3 lg:gap-4 items-center lg:items-start"
          variants={containerAnim}
          initial="hidden"
          animate="show"
        >
          {/* Top row: Available + Hi there! stickers (rotated, varied) */}
          <motion.div variants={itemAnim} className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {isAvailable && (
              <div
                className="inline-flex items-center gap-2 cartoon-border-sm bg-mint px-4 py-2 rounded-full w-fit"
                style={{ transform: "rotate(-1.5deg)" }}
              >
                <span className="w-2 h-2 bg-ink rounded-full animate-pulse" />
                <span className="font-body font-semibold text-sm text-ink">
                  Available for Projects
                </span>
              </div>
            )}
            <motion.div
              whileHover={{ rotate: -3, scale: 1.05 }}
              className="inline-flex items-center gap-1.5 cartoon-border-sm bg-yellow px-3 py-1.5 rounded-full w-fit"
              style={{ transform: "rotate(2deg)" }}
            >
              <span className="text-base leading-none">👋</span>
              <span className="font-body font-bold text-[11px] text-ink uppercase tracking-wider">
                Hi there!
              </span>
            </motion.div>
          </motion.div>

          {/* Name section — stacked sticker treatment */}
          <motion.div variants={itemAnim} className="flex flex-col gap-2 items-center lg:items-start">
            {/* First name(s) — big yellow stroke text */}
            <h1
              className="hero-stroke-text font-display font-extrabold leading-none text-[clamp(1.75rem,5.5vw,5rem)] pb-1 pr-2"
            >
              {firstNames.toUpperCase()}
            </h1>

            {/* Last name (violet sticker) + face circle — only if there's a last name */}
            {lastName ? (
              <div className="flex items-center gap-3 flex-wrap -mt-1 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ rotate: 2, scale: 1.04, y: -2 }}
                  className="bg-violet cartoon-border rounded-2xl px-4 py-1 inline-block"
                  style={{ transform: "rotate(-2deg)" }}
                >
                  <span className="font-display font-extrabold text-cream text-[clamp(1.1rem,4vw,3.5rem)] leading-tight block">
                    {lastName.toUpperCase()}
                  </span>
                </motion.div>

                {/* Face circle */}
                <motion.div
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full cartoon-border overflow-hidden shrink-0 bg-yellow flex items-center justify-center relative"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.75, type: "spring", stiffness: 280, damping: 18 }}
                  whileHover={{ rotate: 8, scale: 1.08 }}
                >
                  {activeImage ? (
                    <AnimatePresence mode="sync">
                      <motion.img
                        key={activeImage}
                        src={activeImage}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    </AnimatePresence>
                  ) : (
                    <span className="font-display font-bold text-ink text-2xl leading-none select-none">
                      {name.charAt(0)}
                    </span>
                  )}
                </motion.div>

                {/* Sparkle doodle */}
                <motion.span
                  className="text-coral text-lg md:text-3xl select-none"
                  animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✦
                </motion.span>
              </div>
            ) : (
              /* Single-word name — show face circle inline */
              <motion.div
                className="w-14 h-14 rounded-full cartoon-border overflow-hidden shrink-0 bg-yellow flex items-center justify-center relative"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.75, type: "spring", stiffness: 280, damping: 18 }}
              >
                {activeImage ? (
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </AnimatePresence>
                ) : (
                  <span className="font-display font-bold text-ink text-2xl leading-none select-none">
                    {name.charAt(0)}
                  </span>
                )}
              </motion.div>
            )}

            {/* aka MIZARIE — plain italic caption, no pill */}
            <p
              className="font-display font-bold text-coral text-sm md:text-xl italic tracking-wide mt-1 inline-flex items-center gap-1.5"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span className="text-base opacity-60">✦</span>
              aka {alias.toUpperCase()}
              <span className="text-base opacity-60">✦</span>
            </p>
          </motion.div>

          {/* Cycling role text — inline sentence, no pill */}
          <motion.div variants={itemAnim} className="flex items-center gap-2.5 flex-wrap justify-center lg:justify-start">
            <span className="font-body text-muted text-sm md:text-lg italic">
              I build
            </span>
            <CyclingText
              texts={heroRoles}
              className="font-display font-bold text-[clamp(0.85rem,2.5vw,1.5rem)] text-coral"
            />
            <motion.span
              className="text-coral text-lg md:text-xl select-none"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ▸
            </motion.span>
          </motion.div>

          {/* Role sticker tags — more breathing room */}
          <motion.div variants={itemAnim} className="flex flex-wrap gap-1.5 lg:gap-2.5 mt-0 justify-center lg:justify-start">
            {rolePills.map((role) => (
              <span
                key={role.label}
                className={`cartoon-border ${role.color} font-body font-semibold px-2 py-1 lg:px-3 lg:py-1.5 rounded-full inline-block text-xs lg:text-sm`}
                style={{ transform: `rotate(${role.rotation})` }}
              >
                {role.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemAnim} className="flex flex-wrap gap-2 lg:gap-3 mt-1 lg:mt-3 justify-center lg:justify-start">
            <a
              href="#works"
              className="cartoon-border bg-navy text-cream font-body font-semibold px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              See My Work ↓
            </a>
            <a
              href="#contact"
              className="cartoon-border bg-coral text-cream font-body font-semibold px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              Let&apos;s Talk ✉
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right: Artboard ── */}
        <ScrollReveal
          variant="scale-in"
          delay={0.3}
          className="flex flex-col items-center justify-center gap-2 order-first lg:order-last"
        >
          <motion.div
            className="relative w-56 h-64 lg:w-72 lg:h-80 cursor-pointer"
            onHoverStart={() => setArtHovered(true)}
            onHoverEnd={() => setArtHovered(false)}
            onClick={() => setArtHovered((prev) => !prev)}
            whileHover={{ scale: 1.04, rotate: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
          >
            {/* Burst shapes — pop out on hover */}
            <AnimatePresence>
              {artHovered && burstItems.map((b, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${b.color} ${b.size} ${b.shape} cartoon-border-sm pointer-events-none z-20`}
                  style={b.style}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, b.floatY, 0] }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                  transition={{
                    scale:   { delay: b.delay, duration: 0.3, type: "spring", stiffness: 400 },
                    opacity: { delay: b.delay, duration: 0.2 },
                    y:       { delay: b.delay + 0.2, duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Main box */}
            <motion.div
              className="absolute inset-0 cartoon-border-lg rounded-3xl flex items-center justify-center overflow-hidden"
              animate={{ backgroundColor: artHovered ? "#fbbf24" : "#fef08a" }}
              transition={{ duration: 0.4 }}
            >
              {/* Dot grid — brightens on hover */}
              <motion.div
                className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-4 pointer-events-none"
                animate={{ opacity: artHovered ? 0.22 : 0.08 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="bg-ink rounded-full" />
                ))}
              </motion.div>

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
                <motion.span
                  className="font-display font-extrabold text-[7rem] select-none leading-none text-ink"
                  animate={{ opacity: artHovered ? 0.18 : 0.08, scale: artHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.35 }}
                >
                  MG
                </motion.span>
              )}

              {/* Label pill — "real me" idle, "illustrated ✏️" on hover */}
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
                    <span className="font-body text-[10px] font-bold text-cream tracking-wide">
                      {artHovered && illustrationUrl ? "illustrated ✏️" : "real me 📷"}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* "hover me" hint — only show when illustration is available */}
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
                      <span className="font-body text-[10px] font-bold text-cream tracking-wide">
                        <span className="hidden lg:inline">hover me ✦</span>
                        <span className="lg:hidden">tap to flip ✦</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* "✦ nice!" label on hover */}
              <AnimatePresence>
                {artHovered && (
                  <motion.div
                    className="absolute top-4 left-4 bg-navy cartoon-border-sm rounded-full px-3 py-1 pointer-events-none z-10"
                    initial={{ opacity: 0, scale: 0, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="font-body text-[10px] font-bold text-cream tracking-wide">✦ nice!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Spinning label ring — spins faster on hover */}
            <motion.div
              className="absolute -top-8 -right-8 w-20 h-20 bg-coral cartoon-border rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{
                duration: artHovered ? 6 : 18,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <span className="font-display font-bold text-cream text-[10px] tracking-wider">✦ ART ✦</span>
            </motion.div>

            {/* Blob — bigger wiggle on hover */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-violet cartoon-border"
              style={{ borderRadius: "42% 58% 55% 45% / 48% 52% 62% 38%" }}
              animate={{ rotate: artHovered ? [-8, 8, -8] : [-5, 5, -5], scale: artHovered ? 1.2 : 1 }}
              transition={{
                rotate: { duration: artHovered ? 2 : 4, repeat: Infinity, ease: "easeInOut" },
                scale:  { duration: 0.3, type: "spring" },
              }}
            />

            {/* Square — faster spin on hover */}
            <motion.div
              className="absolute top-1/2 -right-10 w-9 h-9 bg-mint cartoon-border"
              animate={{ rotate: 360 }}
              transition={{ duration: artHovered ? 2 : 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

        </ScrollReveal>
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
