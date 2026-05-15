"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CyclingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export default function CyclingText({
  texts,
  className,
  interval = 2800,
}: CyclingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span
      className="inline-block overflow-hidden relative"
      style={{ verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className={`inline-block ${className ?? ""}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
