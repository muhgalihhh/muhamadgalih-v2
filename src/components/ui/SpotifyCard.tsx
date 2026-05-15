"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";

interface SpotifyCardProps {
  embedUrl: string;
  className?: string;
  height?: number;
}

export default function SpotifyCard({ embedUrl, className = "", height = 152 }: SpotifyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`cartoon-border rounded-2xl overflow-hidden bg-ink ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-ink border-b-2 border-cream/10">
        <Music size={13} className="text-cream/50" />
        <span className="font-body text-[11px] text-cream/50 font-semibold tracking-wider uppercase">
          Now listening
        </span>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ display: "block" }}
        title="Spotify player"
      />
    </motion.div>
  );
}
