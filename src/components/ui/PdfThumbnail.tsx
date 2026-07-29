"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

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
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setStatus("loading");
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const pdf = await pdfjs.getDocument({ url }).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (cancelled || !canvas || !wrapper) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = wrapper.clientWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvas, canvasContext: ctx, viewport: scaledViewport }).promise;
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    render();
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div ref={wrapperRef} className={`relative flex items-center justify-center overflow-hidden ${status === "ok" ? "" : fallbackClassName} ${className ?? ""}`}>
      <canvas ref={canvasRef} className={`w-full h-full object-contain ${status === "ok" ? "" : "opacity-0 absolute"}`} />
      {status === "loading" && <Loader2 size={16} className={`animate-spin ${iconClassName}`} />}
      {status === "error" && <FileText size={20} className={iconClassName} strokeWidth={1.2} />}
    </div>
  );
}
