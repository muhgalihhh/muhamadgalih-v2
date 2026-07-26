"use client";

import { ExternalLink, FileText } from "lucide-react";
import type { ProjectLink } from "@/types/portfolio";

export default function ProjectLinks({
  links,
  linkClassName,
  onPreviewPdf,
}: {
  links: ProjectLink[];
  linkClassName: string;
  onPreviewPdf: (link: ProjectLink) => void;
}) {
  if (!links || links.length === 0) return null;

  return (
    <>
      {links.map((link) =>
        link.url.toLowerCase().endsWith(".pdf") ? (
          <button key={`${link.label}-${link.url}`} type="button" onClick={() => onPreviewPdf(link)} className={linkClassName}>
            <FileText size={14} />
            {link.label}
          </button>
        ) : (
          <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            <ExternalLink size={14} />
            {link.label}
          </a>
        )
      )}
    </>
  );
}
