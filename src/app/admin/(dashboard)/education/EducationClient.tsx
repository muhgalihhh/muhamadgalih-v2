"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEducation, updateEducation, deleteEducation, uploadFile } from "@/app/actions/admin";
import ColorPicker from "@/components/admin/ColorPicker";
import IconPicker from "@/components/admin/IconPicker";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Education } from "@/types/portfolio";
import { Plus, Pencil, Trash2, X, Upload, Loader2, GraduationCap } from "lucide-react";

type FormMode = "add" | "edit" | null;

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition bg-white";
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

function EducationForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<Education>;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [logoUrl, setLogoUrl]     = useState(defaultValues?.institution_logo_url ?? "");
  const [iconKey, setIconKey]     = useState(defaultValues?.institution_logo_emoji ?? "");
  const [uploading, setUploading] = useState(false);

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

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Degree *">
        <input name="degree" required defaultValue={defaultValues?.degree ?? ""} placeholder="e.g. Bachelor of Computer Science" className={inputCls} />
      </Field>
      <Field label="Institution *">
        <input name="institution" required defaultValue={defaultValues?.institution ?? ""} placeholder="e.g. Universitas Jenderal Soedirman" className={inputCls} />
      </Field>
      <Field label="Period * — teks tampilan">
        <input name="period" required defaultValue={defaultValues?.period ?? ""} placeholder="2022 · Present" className={inputCls} />
      </Field>
      <Field label="GPA (optional)">
        <input name="gpa" defaultValue={defaultValues?.gpa ?? ""} placeholder="3.78 / 4.00" className={inputCls} />
      </Field>

      <Field label="Start Date — untuk urutan">
        <input name="start_date" type="date" defaultValue={defaultValues?.start_date ?? ""} className={inputCls} />
      </Field>
      <Field label="End Date — kosong = sekarang">
        <input name="end_date" type="date" defaultValue={defaultValues?.end_date ?? ""} className={inputCls} />
      </Field>

      <Field label="Institution Icon">
        <input type="hidden" name="institution_logo_emoji" value={iconKey} />
        <IconPicker value={iconKey} onChange={setIconKey} placeholder="Search icons… (e.g. school, book, graduation)" />
      </Field>

      <Field label="Institution Logo (optional)">
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
              name="institution_logo_url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Or paste image URL"
              className={inputCls}
            />
          </div>
        </div>
      </Field>

      <div className="col-span-2">
        <ColorPicker label="Card Color" nameBg="color_class" nameText="text_color_class" defaultBg={defaultValues?.color_class ?? "bg-sky"} />
      </div>

      <Field label="Bullet Points — one per line" wide>
        <textarea
          name="points"
          rows={4}
          defaultValue={defaultValues?.points?.join("\n") ?? ""}
          placeholder={"Thesis: analyzed...\nBuilt a dashboard integrating...\nGraduated cumlaude in..."}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div className="col-span-2 pt-4 border-t border-slate-100 flex gap-2">
        <button type="submit" disabled={isPending} className="bg-violet hover:brightness-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Education"}
        </button>
      </div>
    </form>
  );
}

export default function EducationClient({ initialEducation }: { initialEducation: Education[] }) {
  const [formMode, setFormMode]   = useState<FormMode>(null);
  const [editing, setEditing]     = useState<Education | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg]             = useState("");

  const router = useRouter();
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (edu: Education) => { setEditing(edu); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateEducation(editing.id, fd)
        : await createEducation(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    startTransition(async () => { await deleteEducation(id); reload(); });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Education</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialEducation.length} entries</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-violet hover:brightness-90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Education
          </button>
        )}
      </div>

      {/* Form panel */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.degree}"` : "New Education"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <div className="p-6">
            <EducationForm defaultValues={editing ?? undefined} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </div>
      )}

      {/* List */}
      {initialEducation.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <GraduationCap size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No education entries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {initialEducation.map((edu) => (
            <div key={edu.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${editing?.id === edu.id ? "bg-violet/10" : ""}`}>
              <div className={`${edu.color_class} w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border-2 border-black/5 shadow-sm overflow-hidden`}>
                {edu.institution_logo_url
                  ? <img src={edu.institution_logo_url} alt={edu.institution} className="w-full h-full object-cover" />
                  : edu.institution_logo_emoji
                    ? <SkillIcon icon={edu.institution_logo_emoji} className="w-5 h-5 opacity-80" />
                    : <GraduationCap size={18} className="opacity-40" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{edu.degree}</p>
                <p className="text-slate-500 text-xs mt-0.5">{edu.institution} <span className="text-slate-300 mx-1">·</span> {edu.period}</p>
                <p className="text-slate-400 text-xs mt-0.5">{edu.points.length} bullet points{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(edu)}
                  className="p-2 rounded-lg text-slate-400 hover:text-violet hover:bg-violet/10 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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
