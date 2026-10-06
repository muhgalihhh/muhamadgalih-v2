"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";
import AnimatedText from "@/components/animations/AnimatedText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillIcon from "@/components/ui/SkillIcon";
import ProjectLinks from "@/components/works/ProjectLinks";
import PdfPreviewModal from "@/components/works/PdfPreviewModal";
import type { Project, ProjectLink } from "@/types/portfolio";

export default function ProjectHeader({
  project,
  categoryLabel,
  experience,
}: {
  project: Pick<Project, "title" | "emoji" | "color_class" | "text_color_class" | "tech_stack" | "links">;
  categoryLabel: string;
  experience: { role: string; company: string } | null;
}) {
  const [previewLink, setPreviewLink] = useState<ProjectLink | null>(null);

  return (
    <header className={`card-surface ${project.color_class} ${project.text_color_class} border-b-[3px] border-ink`}>
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-24 md:pt-14 pb-20 md:pb-24">
        <Link
          href="/works"
          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold bg-black/15 hover:bg-black/25 px-3 py-1.5 rounded-full transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Works
        </Link>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black/15 cartoon-border-sm flex items-center justify-center shrink-0">
            <SkillIcon icon={project.emoji} className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <AnimatedText as="h1"
            text={project.title}
            once
            className="font-display font-extrabold text-[clamp(1.6rem,4.5vw,3.25rem)] leading-[1.08]"
          />
        </div>

        <ScrollReveal variant="fade-up" delay={0.2} once>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-body text-xs font-semibold bg-black/15 px-3 py-1 rounded-full capitalize">{categoryLabel}</span>
            {experience && (
              <span className="font-body text-xs font-semibold bg-black/15 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Briefcase size={12} className="shrink-0" />
                {experience.role} · {experience.company}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech_stack.map((t) => (
              <span key={t} className="font-body text-[11px] md:text-xs font-semibold bg-black/15 cartoon-border-sm px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <ProjectLinks
                links={project.links}
                onPreviewPdf={setPreviewLink}
                linkClassName="inline-flex items-center gap-2 cartoon-border bg-cream text-ink font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              />
            </div>
          )}
        </ScrollReveal>
      </div>
      <PdfPreviewModal link={previewLink} onClose={() => setPreviewLink(null)} />
    </header>
  );
}
