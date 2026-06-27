"use client";
import { useState } from "react";

export const PALETTE = [
  { bg: "bg-violet",  text: "text-cream", hex: "#845EF7" },
  { bg: "bg-coral",   text: "text-cream", hex: "#FF5757" },
  { bg: "bg-sky",     text: "text-ink",   hex: "#4CC9F0" },
  { bg: "bg-mint",    text: "text-ink",   hex: "#06D6A0" },
  { bg: "bg-yellow",  text: "text-ink",   hex: "#FFD166" },
  { bg: "bg-pink",    text: "text-cream", hex: "#FF6B9D" },
  { bg: "bg-navy",    text: "text-cream", hex: "#120E2D" },
  { bg: "bg-ink",     text: "text-cream", hex: "#0D0B1E" },
] as const;

// Snap any custom hex to the closest theme color (Euclidean RGB distance),
// so cards always stay on-theme even when picked freely.
function nearestPaletteBg(hex: string): string {
  const rgb = (h: string) => {
    const v = h.replace("#", "");
    const n = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  };
  const [r, g, b] = rgb(hex);
  let best: (typeof PALETTE)[number] = PALETTE[0];
  let min = Infinity;
  for (const p of PALETTE) {
    const [pr, pg, pb] = rgb(p.hex);
    const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (d < min) { min = d; best = p; }
  }
  return best.bg;
}

interface ColorPickerProps {
  label?: string;
  defaultBg?: string;
  defaultText?: string;
  nameBg: string;
  nameText?: string;
  combined?: boolean;
}

export default function ColorPicker({
  label = "Card Color",
  defaultBg = "bg-violet",
  nameBg,
  nameText,
  combined = false,
}: ColorPickerProps) {
  // Parse defaultBg — may be "bg-violet" or "bg-violet text-cream" (combined)
  const initBg = defaultBg.split(" ")[0];
  const [selectedBg, setSelectedBg] = useState(initBg);

  const entry = PALETTE.find((p) => p.bg === selectedBg) ?? PALETTE[0];

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {PALETTE.map((p) => (
          <button
            key={p.bg}
            type="button"
            onClick={() => setSelectedBg(p.bg)}
            title={p.bg.replace("bg-", "")}
            className={`w-7 h-7 rounded-full border-2 transition-all ${p.bg} ${
              selectedBg === p.bg
                ? "border-slate-900 scale-125 shadow-md"
                : "border-white/50 hover:scale-110 hover:border-slate-400"
            }`}
          />
        ))}
        {/* Custom picker — snaps to nearest theme color */}
        <label
          title="Pick a custom color (snaps to nearest theme color)"
          className="w-7 h-7 rounded-full border-2 border-dashed border-slate-400 grid place-items-center cursor-pointer hover:border-slate-600 text-slate-500 text-sm overflow-hidden relative"
        >
          🎨
          <input
            type="color"
            defaultValue={entry.hex}
            onChange={(e) => setSelectedBg(nearestPaletteBg(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
      <span className="text-[10px] text-slate-400">
        Custom color otomatis disesuaikan ke warna tema terdekat ({entry.bg.replace("bg-", "")}).
      </span>
      {/* Preview chip */}
      <span
        className={`${entry.bg} ${entry.text} text-[11px] font-semibold px-3 py-1 rounded-full w-fit`}
      >
        Preview
      </span>
      {/* Hidden inputs */}
      {combined ? (
        <input type="hidden" name={nameBg} value={`${entry.bg} ${entry.text}`} />
      ) : (
        <>
          <input type="hidden" name={nameBg} value={entry.bg} />
          {nameText && <input type="hidden" name={nameText} value={entry.text} />}
        </>
      )}
    </div>
  );
}
