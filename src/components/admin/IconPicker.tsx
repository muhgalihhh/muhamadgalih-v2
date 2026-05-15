"use client";

import { useState, useRef, useEffect } from "react";
import { ICON_REGISTRY, ICON_MAP, isRegistryKey } from "@/lib/iconRegistry";
import { Search, X, ChevronDown } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (key: string) => void;
  placeholder?: string;
}

export default function IconPicker({ value, onChange, placeholder = "Search icons... (e.g. react, figma, docker)" }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = query.toLowerCase().trim();
  const results = q.length >= 1
    ? ICON_REGISTRY.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 10)
    : ICON_REGISTRY.slice(0, 10);

  const selected = isRegistryKey(value) ? ICON_MAP[value] : null;
  const SelectedIcon = selected?.component ?? null;

  const select = (key: string) => {
    onChange(key);
    setQuery("");
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white cursor-text transition ${
          open ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-slate-200"
        }`}
        onClick={() => { setOpen(true); containerRef.current?.querySelector("input")?.focus(); }}
      >
        {SelectedIcon
          ? <SelectedIcon className="w-4 h-4 text-slate-600 shrink-0" />
          : <Search size={14} className="text-slate-400 shrink-0" />
        }

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected ? selected.label : placeholder}
          className="flex-1 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400 min-w-0"
        />

        {value && (
          <button type="button" onClick={clear} className="text-slate-300 hover:text-red-400 transition-colors shrink-0 p-0.5">
            <X size={12} />
          </button>
        )}
        <ChevronDown
          size={13}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Suggestions dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1">
            {results.map((entry) => {
              const Icon = entry.component;
              const isActive = value === entry.key;
              return (
                <button
                  key={entry.key}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); select(entry.key); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{entry.label}</span>
                  {isActive && <span className="text-xs text-indigo-300">✓</span>}
                </button>
              );
            })}
            {results.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-5">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
          <div className="px-3.5 py-2 border-t border-slate-100 text-[10px] text-slate-400">
            {q ? `${results.length} of ${ICON_REGISTRY.filter(e => e.label.toLowerCase().includes(q)).length} results` : `${ICON_REGISTRY.length} icons — type to filter`}
          </div>
        </div>
      )}
    </div>
  );
}
