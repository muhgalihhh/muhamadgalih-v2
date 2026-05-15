"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MusicPlayerProps {
  musicUrl?: string | null;
  songTitle?: string | null;
}

function audioMimeType(url: string): string | undefined {
  const u = url.split("?")[0].toLowerCase();
  if (u.endsWith(".mp3"))  return "audio/mpeg";
  if (u.endsWith(".ogg"))  return "audio/ogg";
  if (u.endsWith(".wav"))  return "audio/wav";
  if (u.endsWith(".m4a"))  return "audio/mp4";
  if (u.endsWith(".webm")) return "audio/webm";
  if (u.endsWith(".aac"))  return "audio/aac";
  return undefined;
}

export default function MusicPlayer({ musicUrl, songTitle }: MusicPlayerProps) {
  const audioUrl   = musicUrl  ?? "";
  const displayTitle = songTitle ?? "vibes";

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [expanded, setExpanded]   = useState(false);
  const [duration, setDuration]   = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () =>
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const onLoadedMeta  = () => setDuration(audio.duration);
    const onEnded       = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener("timeupdate",  onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended",       onEnded);
    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended",          onEnded);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // No audio source yet — just toggle visual state
        setIsPlaying(true);
      }
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[300] flex flex-col items-end gap-2">
      <audio ref={audioRef} loop preload="metadata">
        {audioUrl && <source src={audioUrl} type={audioMimeType(audioUrl)} />}
      </audio>

      {/* Expanded mini player */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="cartoon-border bg-navy text-cream rounded-2xl p-4 w-56"
          >
            {/* Header row: now playing + close button */}
            <div className="flex items-center gap-3 mb-3">
              {/* Animated vinyl */}
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-coral cartoon-border-sm flex items-center justify-center shrink-0"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-3 h-3 rounded-full bg-navy" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-xs truncate">{displayTitle}</p>
                <p className="font-body text-[10px] text-cream/50">MIZARIE · vibes</p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-6 h-6 rounded-full bg-cream/10 hover:bg-cream/20 flex items-center justify-center shrink-0 transition-colors"
                aria-label="Close player"
              >
                <X size={12} />
              </button>
            </div>

            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-cream/20 rounded-full cursor-pointer mb-1.5 relative overflow-hidden"
              onClick={seek}
            >
              <motion.div
                className="absolute left-0 top-0 h-full bg-coral rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-body text-[10px] text-cream/40">
              <span>{audioRef.current ? fmt(audioRef.current.currentTime) : "0:00"}</span>
              <span>{fmt(duration)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => { toggle(); setExpanded(true); }}
        className="w-14 h-14 rounded-full cartoon-border bg-navy text-cream flex items-center justify-center shadow-lg relative overflow-hidden"
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        title="Play / pause music"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {/* Pulse ring when playing */}
        {isPlaying && (
          <motion.span
            className="absolute inset-0 rounded-full bg-coral/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Bars / play icon */}
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="bars"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-end gap-0.5 h-5"
            >
              {[0, 0.15, 0.3, 0.15].map((d, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-cream"
                  animate={{ height: ["40%", "100%", "60%", "100%", "40%"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: d, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.svg
              key="play"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 translate-x-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
