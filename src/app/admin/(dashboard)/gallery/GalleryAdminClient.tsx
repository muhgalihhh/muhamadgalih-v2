"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadFile,
} from "@/app/actions/admin";
import type { GalleryItem } from "@/types/portfolio";
import {
  Plus, Pencil, Trash2, X, Upload, Loader2, Images, ChevronDown, Check,
  CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";

type FormMode = "add" | "edit" | null;
type ToastType = "success" | "error" | "info";
interface Toast { type: ToastType; msg: string }

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition bg-white";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

function ToastBar({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  const styles: Record<ToastType, { bar: string; icon: React.ReactNode }> = {
    success: {
      bar: "bg-emerald-600 text-white",
      icon: <CheckCircle2 size={16} className="shrink-0" />,
    },
    error: {
      bar: "bg-red-600 text-white",
      icon: <XCircle size={16} className="shrink-0" />,
    },
    info: {
      bar: "bg-slate-700 text-white",
      icon: <AlertCircle size={16} className="shrink-0" />,
    },
  };

  const { bar, icon } = styles[toast.type];
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium max-w-sm animate-in slide-in-from-bottom-2 ${bar}`}>
      {icon}
      <span className="flex-1">{toast.msg}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-1">
        <X size={14} />
      </button>
    </div>
  );
}

const CATEGORIES = [
  { value: "illustration", label: "Illustration" },
  { value: "uiux",         label: "UI/UX" },
  { value: "branding",     label: "Branding" },
  { value: "motion",       label: "Motion" },
];

function ItemForm({
  defaultValues,
  onSubmit,
  onUploadError,
  isPending,
}: {
  defaultValues?: Partial<GalleryItem>;
  onSubmit: (fd: FormData) => void;
  onUploadError: (msg: string) => void;
  isPending: boolean;
}) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues?.image_urls ?? []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const results = await Promise.all(
      files.map((file) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        return uploadFile(fd);
      })
    );
    const newUrls = results.map((r) => r.url).filter((u): u is string => !!u);
    const failed = results.filter((r) => !r.url);
    if (newUrls.length) setImageUrls((prev) => [...prev, ...newUrls]);
    if (failed.length) onUploadError(failed[0].error ?? "Upload gagal. Coba lagi.");
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (url: string) => setImageUrls((prev) => prev.filter((u) => u !== url));

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("image_urls", imageUrls.join("\n"));
        onSubmit(fd);
      }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Images * — collage kalau lebih dari satu">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
            {uploading
              ? <Loader2 size={13} className="animate-spin text-violet" />
              : <Upload size={13} className="text-slate-400" />}
            {uploading ? "Uploading..." : "Choose Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div key={url} className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {imageUrls.length === 0 && !uploading && (
            <p className="text-[11px] text-red-400">Minimal 1 gambar wajib diisi.</p>
          )}
        </div>
      </Field>

      <Field label="Title (optional)">
        <input
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          placeholder="e.g. Character Design"
          className={inputCls}
        />
      </Field>

      <Field label="Deskripsi Singkat (optional)">
        <textarea
          name="description"
          rows={2}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="e.g. Karakter untuk brand lokal Indonesia"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="Category">
        <div className="relative">
          <select
            name="category"
            defaultValue={defaultValues?.category ?? "illustration"}
            className={`${inputCls} appearance-none pr-8 w-full`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <Field label="Visibility">
        <div className="relative">
          <select
            name="published"
            defaultValue={String(defaultValues?.published ?? true)}
            className={`${inputCls} appearance-none pr-8 w-full`}
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <Field label="Sort Order">
        <input
          name="sort_order"
          type="number"
          defaultValue={defaultValues?.sort_order ?? 0}
          min={0}
          className={inputCls}
        />
      </Field>

      <div className="col-span-2 pt-4 border-t border-slate-100 flex gap-2">
        <button
          type="submit"
          disabled={isPending || uploading || imageUrls.length === 0}
          className="bg-violet hover:brightness-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add to Gallery"}
        </button>
      </div>
    </form>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  illustration: "bg-violet-100 text-violet-700",
  uiux:         "bg-sky-100 text-sky-700",
  branding:     "bg-amber-100 text-amber-700",
  motion:       "bg-pink-100 text-pink-700",
};

export default function GalleryAdminClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [formMode, setFormMode]         = useState<FormMode>(null);
  const [editing, setEditing]           = useState<GalleryItem | null>(null);
  const [isPending, startTransition]    = useTransition();
  const [toast, setToast]               = useState<Toast | null>(null);
  const [batchFiles, setBatchFiles]     = useState<File[]>([]);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchCategory, setBatchCategory]   = useState("illustration");

  const router   = useRouter();
  const showToast = (type: ToastType, msg: string) => setToast({ type, msg });
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setBatchFiles([]); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };
  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setFormMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateGalleryItem(editing.id, fd)
        : await createGalleryItem(fd);
      if (res?.error) {
        showToast("error", `Gagal menyimpan: ${res.error}`);
      } else {
        showToast("success", formMode === "edit" ? "Item berhasil diperbarui." : "Item berhasil ditambahkan ke gallery.");
        reload();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus item ini dari gallery?")) return;
    startTransition(async () => {
      await deleteGalleryItem(id);
      showToast("success", "Item berhasil dihapus.");
      router.refresh();
    });
  };

  const handleBatchUpload = async () => {
    if (!batchFiles.length) return;
    setBatchUploading(true);
    let ok = 0;
    let fail = 0;
    for (const file of batchFiles) {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      uploadFd.append("folder", "gallery");
      const res = await uploadFile(uploadFd);
      if (res.url) {
        const itemFd = new FormData();
        itemFd.set("image_urls", res.url);
        itemFd.set("title", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
        itemFd.set("description", "");
        itemFd.set("category", batchCategory);
        itemFd.set("published", "true");
        itemFd.set("sort_order", "0");
        const saved = await createGalleryItem(itemFd);
        if (saved?.error) { fail++; } else { ok++; }
      } else {
        fail++;
      }
    }
    setBatchUploading(false);
    setBatchFiles([]);
    if (fail === 0) {
      showToast("success", `${ok} gambar berhasil diupload.`);
    } else if (ok === 0) {
      showToast("error", `Semua upload gagal (${fail} file). Cek koneksi atau ukuran file.`);
    } else {
      showToast("info", `${ok} berhasil, ${fail} gagal diupload.`);
    }
    router.refresh();
  };

  return (
    <>
    {toast && <ToastBar toast={toast} onClose={() => setToast(null)} />}
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Design Gallery</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialItems.length} items</p>
        </div>
        {!formMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-violet hover:brightness-90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus size={15} /> Add Item
            </button>
          </div>
        )}
      </div>

      {/* Batch upload panel */}
      {!formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Upload Banyak Gambar Sekaligus</p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">
                Pilih Gambar
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
                <Upload size={13} className="text-slate-400" />
                {batchFiles.length > 0 ? `${batchFiles.length} file dipilih` : "Pilih file (bisa banyak)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setBatchFiles(Array.from(e.target.files ?? []))}
                />
              </label>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={handleBatchUpload}
              disabled={!batchFiles.length || batchUploading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              {batchUploading
                ? <><Loader2 size={13} className="animate-spin" /> Uploading...</>
                : <><Check size={13} /> Upload {batchFiles.length > 0 ? batchFiles.length : ""} Gambar</>}
            </button>
          </div>
          {batchFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {batchFiles.slice(0, 8).map((f, i) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                  {f.name}
                </span>
              ))}
              {batchFiles.length > 8 && (
                <span className="text-[11px] text-slate-400">+{batchFiles.length - 8} lagi</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit form */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.title || "Item"}"` : "Tambah Item Gallery"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          <div className="p-6">
            <ItemForm
              defaultValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onUploadError={(msg) => showToast("error", `Upload gambar gagal: ${msg}`)}
              isPending={isPending}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {initialItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <Images size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">Belum ada gambar — upload sekarang di atas.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {initialItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-3 relative group rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50"
            >
              <div className="relative">
                <img
                  src={item.image_urls[0]}
                  alt={item.title || "Gallery item"}
                  className="w-full h-auto block"
                />
                {item.image_urls.length > 1 && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                    <Images size={11} /> {item.image_urls.length}
                  </span>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.title || <span className="text-slate-400 italic">No title</span>}
                    </p>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">{item.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-slate-100 text-slate-500"}`}>
                        {CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category}
                      </span>
                      {!item.published && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">DRAFT</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-violet hover:bg-violet/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
