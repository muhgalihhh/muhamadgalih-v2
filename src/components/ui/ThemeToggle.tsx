"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
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
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-center justify-center"
        >
          {isDark
            ? <Sun size={16} className="text-yellow-500" strokeWidth={2} />
            : <Moon size={16} className="text-indigo-500" strokeWidth={2} />
          }
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
