"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-video rounded-xl bg-black/10 flex items-center justify-center cartoon-border-sm mb-4">
        <span className="font-body text-sm opacity-40">No screenshots yet</span>
      </div>
    );
  }

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + images.length) % images.length);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
  };

  return (
    <div className="mb-4">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden cartoon-border-sm bg-black/10">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            src={images[current]}
            alt={`${title} screenshot ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white text-xs flex items-center justify-center hover:bg-black/60 transition-colors z-10"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white text-xs flex items-center justify-center hover:bg-black/60 transition-colors z-10"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-black/50 w-4" : "bg-black/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
