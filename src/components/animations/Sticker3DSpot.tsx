"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion, useScroll, type UseScrollOptions } from "framer-motion";
import type { StickerSet } from "./Stickers3D";

// three.js is heavy and purely decorative — load it client-only, after the page
export const Stickers3D = dynamic(() => import("./Stickers3D"), { ssr: false });

type Props = {
  set: StickerSet;
  className?: string; // positions + sizes the anchor box inside a `relative` section; default = beside the heading
  surface?: "light" | "dark";
  offset?: UseScrollOptions["offset"];
};

// A section's 3D accent: pops in when scrolled to, turns and drifts while the section scrolls past.
// Sits behind the section content (z-0), so it never covers text or buttons.
export default function Sticker3DSpot({
  set,
  className = "right-4 top-2 w-20 h-20 md:right-16 md:top-16 md:w-44 md:h-44",
  surface,
  offset = ["start end", "end start"],
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // A little margin so it keeps rendering while the overhanging canvas is still on screen
  const active = useInView(ref, { margin: "120px 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const still = useReducedMotion() ?? false;

  // `className` positions the anchor inside the content column (max-w-7xl, every section's container),
  // not the full-bleed section: zooming out widens the section but not the column, so a sticker placed
  // against the section's edge would drift away from its heading.
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div className="relative max-w-7xl h-full mx-auto">
        <div ref={ref} className={`absolute z-0 ${className}`}>
          <Stickers3D set={set} progress={scrollYProgress} active={active} still={still} surface={surface} />
        </div>
      </div>
    </div>
  );
}
