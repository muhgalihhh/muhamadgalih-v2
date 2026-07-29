"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExperience, updateExperience, deleteExperience, uploadFile } from "@/app/actions/admin";
import ColorPicker from "@/components/admin/ColorPicker";
import IconPicker from "@/components/admin/IconPicker";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Experience } from "@/types/portfolio";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Briefcase, Link2 } from "lucide-react";

type FormMode = "add" | "edit" | null;

// Keep in sync with serverActions.bodySizeLimit in next.config.ts (15mb),
// leaving headroom for FormData overhead.
const MAX_UPLOAD_MB = 12;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition bg-white";
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

function ExperienceForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<Experience>;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [logoUrl, setLogoUrl]     = useState(defaultValues?.company_logo_url ?? "");
  const [iconKey, setIconKey]     = useState(defaultValues?.company_logo_emoji ?? "");
  const [images, setImages]       = useState<string[]>(defaultValues?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "logos");
    const res = await uploadFile(fd);
    if (res.url) setLogoUrl(res.url);
    setUploading(false);
    e.target.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploadError("");

    const tooBig = files.filter((f) => f.size > MAX_UPLOAD_BYTES);
    const ok = files.filter((f) => f.size <= MAX_UPLOAD_BYTES);
    if (tooBig.length) {
      setUploadError(`Skipped ${tooBig.length} file(s) over ${MAX_UPLOAD_MB}MB: ${tooBig.map((f) => f.name).join(", ")}`);
    }
    if (!ok.length) return;

    setGalleryUploading(true);
    try {
      const results = await Promise.all(
        ok.map((file) => {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("folder", "experiences");
          return uploadFile(fd);
        })
      );
      const newUrls = results.map((r) => r.url).filter((u): u is string => !!u);
      const failed = results.filter((r) => r.error).length;
      if (newUrls.length) setImages((p) => [...p, ...newUrls]);
      if (failed) setUploadError((prev) => [prev, `${failed} file(s) failed to upload.`].filter(Boolean).join(" "));
    } catch {
      setUploadError("Upload failed. The file may be too large or the connection dropped. Try again with a smaller image.");
    } finally {
      setGalleryUploading(false);
    }
  };

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("images", images.join("\n"));
        onSubmit(fd);
      }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Role *">
        <input name="role" required defaultValue={defaultValues?.role ?? ""} placeholder="e.g. Frontend Engineer" className={inputCls} />
      </Field>
      <Field label="Company *">
        <input name="company" required defaultValue={defaultValues?.company ?? ""} placeholder="e.g. Acme Corp" className={inputCls} />
      </Field>
      <Field label="Period * — teks tampilan">
        <input name="period" required defaultValue={defaultValues?.period ?? ""} placeholder="2023 · Present" className={inputCls} />
      </Field>

      <Field label="Start Date — untuk urutan">
        <input name="start_date" type="date" defaultValue={defaultValues?.start_date ?? ""} className={inputCls} />
      </Field>
      <Field label="End Date — kosong = sekarang">
        <input name="end_date" type="date" defaultValue={defaultValues?.end_date ?? ""} className={inputCls} />
      </Field>

      <Field label="Company Icon">
        <input type="hidden" name="company_logo_emoji" value={iconKey} />
        <IconPicker value={iconKey} onChange={setIconKey} placeholder="Search icons… (e.g. figma, github, aws)" />
      </Field>

      <Field label="Company Logo (optional)">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <div className="relative w-12 h-12 shrink-0 group">
              <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setLogoUrl("")}
                title="Remove logo"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
              >
                <X size={11} />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-2 flex-1">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
              {uploading ? <Loader2 size={13} className="animate-spin text-violet" /> : <Upload size={13} className="text-slate-400" />}
              {uploading ? "Uploading..." : "Upload logo"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <input
              name="company_logo_url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Or paste image URL"
              className={inputCls}
            />
          </div>
        </div>
      </Field>

      <div className="col-span-2">
        <ColorPicker label="Card Color" nameBg="color_class" nameText="text_color_class" defaultBg={defaultValues?.color_class ?? "bg-violet"} />
      </div>

      <Field label="Bullet Points — one per line" wide>
        <textarea
          name="points"
          rows={4}
          defaultValue={defaultValues?.points?.join("\n") ?? ""}
          placeholder={"Built something cool\nUsed TypeScript\nShipped on time"}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="Photos — shown inline on the About page" wide>
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
          {galleryUploading ? <Loader2 size={13} className="animate-spin text-violet" /> : <Upload size={13} className="text-slate-400" />}
          {galleryUploading ? "Uploading..." : "Upload photos"}
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={galleryUploading} />
        </label>
        <span className="text-[11px] text-slate-400 mt-1">Max {MAX_UPLOAD_MB}MB per photo · JPG, PNG, WebP</span>
        {uploadError && (
          <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-1">{uploadError}</p>
        )}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((url) => (
              <div key={url} className="relative group w-20 h-20">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((u) => u !== url))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center"
                >
                  <X size={9} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <div className="col-span-2 pt-4 border-t border-slate-100 flex gap-2">
        <button type="submit" disabled={isPending || galleryUploading} className="bg-violet hover:brightness-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Experience"}
        </button>
      </div>
    </form>
  );
}

export default function ExperienceClient({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [formMode, setFormMode]   = useState<FormMode>(null);
  const [editing, setEditing]     = useState<Experience | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg]             = useState("");

  const router = useRouter();
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (exp: Experience) => { setEditing(exp); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateExperience(editing.id, fd)
        : await createExperience(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this experience?")) return;
    startTransition(async () => { await deleteExperience(id); reload(); });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Work Experience</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialExperiences.length} entries</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-violet hover:brightness-90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Experience
          </button>
        )}
      </div>

      {/* Form panel */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.role}"` : "New Experience"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <div className="p-6">
            <ExperienceForm defaultValues={editing ?? undefined} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </div>
      )}

      {/* List */}
      {initialExperiences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <Briefcase size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No experience entries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {initialExperiences.map((exp) => (
            <div key={exp.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${editing?.id === exp.id ? "bg-violet/10" : ""}`}>
              {/* Color dot + avatar */}
              <div className={`${exp.color_class} w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border-2 border-black/5 shadow-sm overflow-hidden`}>
                {exp.company_logo_url
                  ? <img src={exp.company_logo_url} alt={exp.company} className="w-full h-full object-cover" />
                  : exp.company_logo_emoji
                    ? <SkillIcon icon={exp.company_logo_emoji} className="w-5 h-5 opacity-80" />
                    : <Briefcase size={18} className="opacity-40" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{exp.role}</p>
                <p className="text-slate-500 text-xs mt-0.5">{exp.company} <span className="text-slate-300 mx-1">·</span> {exp.period}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {exp.points.length} bullet points
                  {exp.images.length > 0 && <> · {exp.images.length} {exp.images.length === 1 ? "photo" : "photos"}</>}
                  {!!exp.linked_projects?.length && (
                    <span className="inline-flex items-center gap-0.5 text-violet ml-1">
                      · <Link2 size={10} /> {exp.linked_projects.length} {exp.linked_projects.length === 1 ? "work linked" : "works linked"}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(exp)}
                  className="p-2 rounded-lg text-slate-400 hover:text-violet hover:bg-violet/10 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
