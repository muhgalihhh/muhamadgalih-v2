"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "loading" | "reveal" | "exit" | "done";

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const t = setTimeout(() => setPhase("reveal"), 1900);
    return () => clearTimeout(t);
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 select-none"
      style={{ zIndex: 9999 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("done");
      }}
    >
      {/* Dark base — hardcoded so it never changes with dark mode */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0D0B1E" }} />

      {/* Loading content */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            key="lc"
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
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
              className="font-body text-xs tracking-[0.4em] uppercase mt-1 mb-14"
              style={{ color: "rgba(245, 240, 255, 0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              MIZARIE
            </motion.p>

            {/* Bouncing dots */}
            <motion.div
              className="flex gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {[0, 0.12, 0.24].map((d, i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#FF5757" }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: d, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circle wipe — yellow circle grows from left edge */}
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            key="cr"
            className="absolute inset-0 bg-yellow"
            style={{ zIndex: 1 }}
            initial={{ clipPath: "circle(0% at 5% 50%)" }}
            animate={{ clipPath: "circle(160% at 5% 50%)" }}
            transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setPhase("exit")}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
