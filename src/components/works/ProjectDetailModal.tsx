"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import ProjectCarousel from "@/components/works/ProjectCarousel";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Project } from "@/types/portfolio";

type ProjectRow = Pick<Project, "id" | "title" | "category" | "description" | "color_class" | "text_color_class" | "tech_stack" | "image_urls" | "emoji" | "link">;

export default function ProjectDetailModal({
  project,
  categoryLabel,
  onClose,
}: {
  project: ProjectRow | null;
  categoryLabel: Record<string, string>;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
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
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-ink/20" />
            </div>

            {/* Colored header */}
            <div className={`card-surface ${project.color_class} ${project.text_color_class} px-5 md:px-7 py-5 shrink-0 relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
              >
                <X size={15} />
              </button>

              <div className="flex items-center gap-3 mb-3 pr-10">
                <div className="w-11 h-11 rounded-xl bg-black/15 cartoon-border-sm flex items-center justify-center shrink-0">
                  <SkillIcon icon={project.emoji} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-xl md:text-2xl leading-tight">
                    {project.title}
                  </h2>
                  <span className="font-body text-xs font-semibold bg-black/15 px-2.5 py-0.5 rounded-full capitalize">
                    {categoryLabel[project.category] ?? project.category}
                  </span>
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="font-body text-[10px] md:text-xs font-semibold bg-black/15 cartoon-border-sm px-2.5 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 md:px-7 py-5 flex flex-col gap-5">

                {/* Screenshot carousel */}
                {project.image_urls.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">
                      Screenshots
                    </p>
                    <div className="rounded-xl overflow-hidden">
                      <ProjectCarousel images={project.image_urls} title={project.title} />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="font-body text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">
                    About this project
                  </p>
                  <p className="font-body text-sm md:text-base text-ink/80 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* CTA */}
                {project.link && project.link !== "#" && (
                  <div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`card-surface inline-flex items-center gap-2 cartoon-border ${project.color_class} ${project.text_color_class} font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform`}
                    >
                      <ExternalLink size={14} />
                      View Live Project
                    </a>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
