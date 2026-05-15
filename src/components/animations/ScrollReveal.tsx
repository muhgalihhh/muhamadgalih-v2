"use client";

import { motion, type Variants } from "framer-motion";

type RevealVariant = "fade-up" | "scale-in" | "fade-left" | "fade-right";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  once?: boolean;
}

const variantMap: Record<RevealVariant, Variants> = {
  "fade-up": {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  "scale-in": {
    hidden: { scale: 0.82, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  "fade-left": {
    hidden: { x: -40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  "fade-right": {
    hidden: { x: 40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
};

export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  once = false,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
