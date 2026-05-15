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
      <div className="flex flex-wrap gap-2">
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
      </div>
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
