"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { renderPdfFirstPage } from "@/lib/pdfRender";

export default function PdfThumbnail({
  url,
  className,
  fallbackClassName = "bg-slate-50",
  iconClassName = "text-slate-400",
}: {
  url: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  // Defer the pdfjs-dist load + rasterization until the card is actually
  // near the viewport — mounting them all at once (e.g. a grid of certs)
  // fires that work in parallel for every card and stalls the page.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    let cancelled = false;

    async function render() {
      setStatus("loading");
      try {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        await renderPdfFirstPage(url, canvas, wrapper.clientWidth);
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    render();
    return () => { cancelled = true; };
  }, [shouldRender, url]);

  return (
    <div ref={wrapperRef} className={`relative flex items-center justify-center overflow-hidden ${status === "ok" ? "" : fallbackClassName} ${className ?? ""}`}>
      <canvas ref={canvasRef} className={`w-full h-full object-contain ${status === "ok" ? "" : "opacity-0 absolute"}`} />
      {status === "loading" && <Loader2 size={16} className={`animate-spin ${iconClassName}`} />}
      {status === "error" && <FileText size={20} className={iconClassName} strokeWidth={1.2} />}
    </div>
  );
}
