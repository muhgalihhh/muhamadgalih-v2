"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProjectCarousel from "@/components/works/ProjectCarousel";
import type { GalleryItem } from "@/types/portfolio";

export default function GalleryDetailModal({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-ink/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="w-full md:max-w-2xl bg-cream rounded-t-3xl md:rounded-2xl cartoon-border overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-ink/20" />
            </div>

            <div className="card-surface bg-yellow text-ink px-5 md:px-7 py-5 shrink-0 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
              >
                <X size={15} />
              </button>
              <h2 className="font-display font-extrabold text-xl md:text-2xl leading-tight pr-10">
                {item.title || "Gallery item"}
              </h2>
              <span className="inline-block mt-2 font-body text-xs font-semibold bg-black/15 px-2.5 py-0.5 rounded-full capitalize">
                {item.category}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-5 md:px-7 py-5 flex flex-col gap-4">
                <ProjectCarousel images={item.image_urls} title={item.title || "Gallery item"} />
                {item.description && (
                  <p className="font-body text-sm md:text-base text-ink/80 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
