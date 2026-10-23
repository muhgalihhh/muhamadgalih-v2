"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  /** Render as a real heading so pages have an outline for screen readers and SEO. */
  as?: "div" | "h1" | "h2";
  /** Extruded 3D block letters (see .text-3d). */
  depth?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const wordContainerVariants = {
  hidden: {},
  visible: {},
};

// Each word stands up from its baseline in 3D, with a little spring
const wordVariants = {
  hidden: { rotateX: -90, y: "25%", opacity: 0 },
  visible: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 18, opacity: { duration: 0.2 } },
  },
};

export default function AnimatedText({
  text,
  className,
  staggerDelay = 0.04,
  once = false,
  as = "div",
  depth,
}: AnimatedTextProps) {
  const words = text.split(" ");
  const Tag = motion[as];

  return (
    <Tag
      className={`max-w-full ${depth ? "text-3d" : ""} ${className ?? ""}`}
      custom={staggerDelay}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em] last:mr-0 perspective-midrange"
          variants={wordContainerVariants}
        >
          <motion.span className="inline-block origin-bottom" variants={wordVariants}>
            {word}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
