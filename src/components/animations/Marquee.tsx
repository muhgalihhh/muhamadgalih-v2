"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import type { Skill } from "@/types/portfolio";

const FALLBACK_ROW1 = [
  "Full-Stack Engineering", "UI/UX Design", "Illustration",
  "Data Science", "Brand Identity", "Motion Design",
  "React & Next.js", "Figma", "TypeScript",
];
const FALLBACK_ROW2 = [
  "Procreate", "Node.js", "Supabase", "Tailwind CSS",
  "Adobe Illustrator", "Framer Motion", "PostgreSQL",
  "After Effects", "Next.js 16",
];

interface RowProps {
  items: string[];
  baseSpeed: number;
}

function MarqueeRow({ items, baseSpeed }: RowProps) {
  const x = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, { stiffness: 280, damping: 45 });
  const extraSpeed = useTransform(smoothVelocity, (v) => -v * 0.14);

  useAnimationFrame((_, delta) => {
    const halfWidth = innerRef.current
      ? innerRef.current.scrollWidth / 2
      : 1400;
    const totalSpeed = baseSpeed + extraSpeed.get();
    let newX = x.get() + totalSpeed * (delta / 1000);
    while (newX <= -halfWidth) newX += halfWidth;
    while (newX > 0) newX -= halfWidth;
    x.set(newX);
  });

  // Repeat until at least 20 entries so short lists fill the full viewport
  const padded: string[] = [];
  if (items.length > 0) {
    while (padded.length < 20) padded.push(...items);
  }
  const doubled = [...padded, ...padded];

  return (
    <div className="overflow-hidden py-2.5">
      <motion.div ref={innerRef} className="flex" style={{ x }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display font-bold text-base md:text-lg text-cream whitespace-nowrap px-5 md:px-8 flex items-center gap-3 shrink-0"
          >
            <span className="text-coral shrink-0 text-[0.5em] -translate-y-0.5">●</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface MarqueeProps {
  bg?: string;
  skills?: Skill[];
}

export default function Marquee({ bg = "bg-navy", skills }: MarqueeProps) {
  let row1: string[];
  let row2: string[];

  if (skills && skills.length > 0) {
    const names = skills.map((s) => s.name);
    const mid = Math.ceil(names.length / 2);
    row1 = names.slice(0, mid);
    row2 = names.slice(mid);
    if (row2.length === 0) row2 = row1;
  } else {
    row1 = FALLBACK_ROW1;
    row2 = FALLBACK_ROW2;
  }

  return (
    <div className={`${bg} border-y-2 border-ink overflow-hidden`}>
      <MarqueeRow items={row1} baseSpeed={-55} />
      <MarqueeRow items={row2} baseSpeed={50} />
    </div>
  );
}
