"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from "framer-motion";
import { Stickers3D } from "@/components/animations/Sticker3DSpot";

type Phase = "loading" | "reveal" | "exit" | "done";

// Once per browser session: a visitor opening a second page (or a shared
// /works/<slug> link after browsing) shouldn't wait for the intro again.
// The head script in app/layout.tsx hides it before hydration via .splash-seen.
const SEEN_KEY = "splash-seen";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [origin, setOrigin] = useState("50% 50%");
  const starRef = useRef<HTMLDivElement>(null);
  const starShown = useRef(() => {});
  const spin = useMotionValue(0);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    if (seen) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    // Hold the monogram at least 700ms; once the star's WebGL is up, give it a beat to pop in.
    // Its three.js chunk (the hero needs it anyway) gets up to 1.8s; past that, go on without it.
    const starReady = new Promise<void>((r) => (starShown.current = r)).then(() => wait(450));
    Promise.all([wait(700), Promise.race([starReady, wait(1800)])]).then(() => {
      if (cancelled) return;
      // The yellow wipe bursts out of the star while it spins once
      const r = starRef.current?.getBoundingClientRect();
      if (r) setOrigin(`${r.left + r.width / 2}px ${r.top + r.height / 2}px`);
      animate(spin, 1, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
      setPhase("reveal");
    });
    return () => {
      cancelled = true;
    };
  }, [spin]);

  if (phase === "done") return null;

  return (
    <motion.div
      data-splash
      className="fixed inset-0 select-none"
      style={{ zIndex: 9999 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("done");
      }}
    >
      {/* Dark base — hardcoded so it never changes with dark mode */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0D0B1E" }} />

      {/* Circle wipe — yellow circle grows out of the star */}
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            key="cr"
            className="absolute inset-0 bg-yellow"
            initial={{ clipPath: `circle(0% at ${origin})` }}
            animate={{ clipPath: `circle(160% at ${origin})` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setPhase("exit")}
          />
        )}
      </AnimatePresence>

      {/* Above the wipe: the star stays through it, the text fades out */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={starRef} className="relative w-24 h-24 md:w-36 md:h-36">
          <Stickers3D set="splash" progress={spin} active still={still} surface={phase === "loading" ? "dark" : "light"} onReady={() => starShown.current()} />
        </div>

        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: phase === "loading" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Monogram */}
          <motion.span
            className="font-display font-extrabold leading-none tracking-tighter"
            style={{ fontSize: "clamp(5rem, 18vw, 12rem)", color: "#F5F0FF" }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            MG
          </motion.span>

          {/* Name */}
          <motion.p
            className="font-body text-xs tracking-[0.4em] uppercase mt-1"
            style={{ color: "rgba(245, 240, 255, 0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            MIZARIE
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
