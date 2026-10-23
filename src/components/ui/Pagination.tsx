"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Client-side paging: the lists are small (tens of rows), what's heavy is rendering every
// card's image / PDF thumbnail at once. Only the current page is rendered.
// ponytail: all rows still come down in one query; switch to .range() + ?page= when a list reaches hundreds.
export function usePaged<T>(items: T[], size: number) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pageCount); // a filter can shrink the list under the current page
  return {
    page: current,
    pageCount,
    setPage,
    visible: items.slice((current - 1) * size, current * size),
  };
}

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** id of the list's container; brought back into view on page change (give it a scroll-mt-* for the navbar) */
  scrollTargetId: string;
  onDark?: boolean;
};

export default function Pagination({ page, pageCount, onChange, scrollTargetId, onDark }: Props) {
  if (pageCount <= 1) return null;

  const go = (n: number) => {
    onChange(n);
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const base = `w-10 h-10 rounded-full font-body font-semibold text-sm inline-flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none ${
    onDark ? "cartoon-border-light text-cream" : "cartoon-border text-ink"
  }`;
  const idle = onDark ? "hover:bg-cream/10" : "hover:bg-yellow";
  const current = onDark ? "bg-yellow !text-ink" : "bg-navy !text-cream";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10 md:mt-12">
      <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={`${base} ${idle}`} aria-label="Previous page">
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      {/* ponytail: every page number is shown; add "…" windowing past ~7 pages */}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => go(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Page ${n}`}
          className={`${base} ${n === page ? current : idle}`}
        >
          {n}
        </button>
      ))}
      <button type="button" onClick={() => go(page + 1)} disabled={page === pageCount} className={`${base} ${idle}`} aria-label="Next page">
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </nav>
  );
}
