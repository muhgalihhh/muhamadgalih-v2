"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={toggle}
      className="w-9 h-9 rounded-full cartoon-border-sm flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-transform relative overflow-hidden"
      style={{ backgroundColor: "#FFFEF0" }}
      aria-label="Toggle dark mode"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.span
        key={isDark ? "sun" : "moon"}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-base leading-none select-none"
      >
        {isDark ? "☀️" : "🌙"}
      </motion.span>
    </motion.button>
  );
}
