"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Download } from "lucide-react";
import type { ProjectLink } from "@/types/portfolio";

export default function PdfPreviewModal({ link, onClose }: { link: ProjectLink | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {link && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="w-full h-full max-w-4xl bg-cream cartoon-border rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-ink bg-navy text-cream shrink-0">
              <span className="font-display font-bold text-sm md:text-base truncate pr-4">{link.label}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={link.url}
                  download
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
                  title="Download"
                >
                  <Download size={15} />
                </a>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <iframe src={link.url} title={link.label} className="flex-1 w-full bg-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
