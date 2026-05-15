"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
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

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function AnimatedText({
  text,
  className,
  staggerDelay = 0.04,
  once = false,
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <motion.div
      className={`max-w-full ${className ?? ""}`}
      custom={staggerDelay}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="overflow-hidden inline-block mr-[0.3em] last:mr-0"
          variants={wordContainerVariants}
        >
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
        </motion.span>
      ))}
    </motion.div>
  );
}
