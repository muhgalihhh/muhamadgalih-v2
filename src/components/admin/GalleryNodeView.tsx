"use client";

import { useState } from "react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { uploadFile } from "@/app/actions/admin";
import type { GalleryImage } from "@/lib/projectContent";

export async function uploadContentImage(file: File): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "projects/content");
  try {
    return await uploadFile(fd);
  } catch {
    // The server action rejects outright when the body exceeds its 15 MB limit.
    return { error: `Upload gagal: ${file.name} — file terlalu besar? (maks 15 MB)` };
  }
}

export default function GalleryNodeView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const images: GalleryImage[] = Array.isArray(node.attrs.images) ? node.attrs.images : [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (next: GalleryImage[]) => updateAttributes({ images: next });
  const move = (i: number, d: -1 | 1) => {
    const next = [...images];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    set(next);
  };
  const add = async (files: File[]) => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    const results = await Promise.all(files.map(uploadContentImage));
    const failed = results.find((r) => !r.url);
    if (failed) setError(failed.error ?? "Upload gagal");
    set([...images, ...results.filter((r) => r.url).map((r) => ({ src: r.url!, alt: "" }))]);
    setBusy(false);
  };

  return (
    <NodeViewWrapper
      contentEditable={false}
      data-drag-handle
      className={`my-4 rounded-xl border-2 p-3 bg-slate-50 ${selected ? "border-violet" : "border-dashed border-slate-300"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Gallery · {images.length} gambar</span>
        <button type="button" onClick={deleteNode} title="Hapus gallery" className="text-slate-400 hover:text-red-500">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <div key={`${img.src}-${i}`} className="relative group aspect-square">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-lg border border-slate-200" />
            <div className="absolute inset-x-1 bottom-1 hidden group-hover:flex justify-between">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center disabled:opacity-30">
                <ChevronLeft size={12} />
              </button>
              <button type="button" onClick={() => set(images.filter((_, j) => j !== i))} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X size={12} />
              </button>
              <button type="button" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center disabled:opacity-30">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
        <label className="aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-violet hover:text-violet cursor-pointer text-xs">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {busy ? "Uploading…" : "Tambah"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              void add(files);
            }}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </NodeViewWrapper>
  );
}
