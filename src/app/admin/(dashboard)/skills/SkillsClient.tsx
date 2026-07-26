"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSkill, deleteSkill, updateSkill, uploadFile } from "@/app/actions/admin";
import ColorPicker from "@/components/admin/ColorPicker";
import IconPicker from "@/components/admin/IconPicker";
import SkillIcon, { isIconUrl } from "@/components/ui/SkillIcon";
import type { Skill } from "@/types/portfolio";
import { Plus, Pencil, Trash2, X, ChevronDown, Wrench, Upload, Loader2 } from "lucide-react";

type FormMode = "add" | "edit" | null;

const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition bg-white";

function SkillForm({ defaultValues, onSubmit, onCancel, isPending }: {
  defaultValues?: Partial<Skill>;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [iconValue, setIconValue] = useState(defaultValues?.icon ?? "");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "icons");
    const res = await uploadFile(fd);
    if (res.url) setIconValue(res.url);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("icon", iconValue);
        onSubmit(fd);
      }}
      className="p-6 grid grid-cols-2 gap-5"
    >
      <Field label="Name *">
        <input name="name" required defaultValue={defaultValues?.name ?? ""} placeholder="e.g. React" className={inputCls} />
      </Field>

      <Field label="Category">
        <div className="relative">
          <select name="category" defaultValue={defaultValues?.category ?? "development"} className={`${inputCls} appearance-none pr-8 w-full`}>
            <option value="development">Development</option>
            <option value="design">Design</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <Field label="Icon" wide>
        <div className="space-y-2">
          <IconPicker value={iconValue} onChange={setIconValue} />
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">or upload custom</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="flex items-center gap-2">
            {iconValue && isIconUrl(iconValue) && (
              <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                <img src={iconValue} alt="" className="w-5 h-5 object-contain" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-3.5 py-2 text-sm text-slate-600 transition-colors">
              {uploading ? <Loader2 size={13} className="animate-spin text-violet" /> : <Upload size={13} className="text-slate-400" />}
              {uploading ? "Uploading..." : "SVG / PNG"}
              <input type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <input
              type="text"
              value={isIconUrl(iconValue) ? iconValue : ""}
              onChange={(e) => setIconValue(e.target.value)}
              placeholder="or paste image URL"
              className={`${inputCls} flex-1 text-xs`}
            />
          </div>
        </div>
      </Field>

      <div className="col-span-2">
        <ColorPicker label="Chip Color" nameBg="color_class" combined defaultBg={defaultValues?.color_class ?? "bg-violet text-cream"} />
      </div>

      <div className="col-span-2 pt-4 border-t border-slate-100 flex gap-2">
        <button type="submit" disabled={isPending || uploading} className="bg-violet hover:brightness-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Skill"}
        </button>
        <button type="button" onClick={onCancel} className="text-slate-500 text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const router = useRouter();
  const reload = () => { close(); router.refresh(); };
  const close = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (s: Skill) => { setEditing(s); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateSkill(editing.id, fd)
        : await createSkill(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this skill?")) return;
    startTransition(async () => { await deleteSkill(id); reload(); });
  };

  const dev    = initialSkills.filter((s) => s.category === "development");
  const design = initialSkills.filter((s) => s.category === "design");

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Skills</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialSkills.length} skills</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-violet hover:brightness-90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Skill
          </button>
        )}
      </div>

      {/* Form panel */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.name}"` : "New Skill"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <SkillForm
            defaultValues={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={close}
            isPending={isPending}
          />
        </div>
      )}

      {/* Skill chips grouped by category */}
      {initialSkills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <Wrench size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No skills yet — add your first one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {[{ label: "Development", items: dev }, { label: "Design", items: design }].map(({ label, items }) =>
            items.length === 0 ? null : (
              <div key={label} className="px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">{label}</p>
                <div className="flex flex-wrap gap-2.5">
                  {items.map((skill) => (
                    <div key={skill.id} className="group/chip relative">
                      <span className={`${skill.color_class} flex items-center gap-1.5 cartoon-border rounded-full px-3.5 py-1.5 text-sm font-semibold cursor-default ${editing?.id === skill.id ? "ring-2 ring-violet ring-offset-1" : ""}`}>
                        {skill.icon && <SkillIcon icon={skill.icon} className="w-4 h-4" />}
                        {skill.name}
                      </span>
                      <div className="absolute -top-2.5 -right-2 hidden group-hover/chip:flex gap-0.5">
                        <button onClick={() => openEdit(skill)} className="w-5 h-5 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-violet hover:border-violet/30 transition-colors">
                          <Pencil size={8} />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="w-5 h-5 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors">
                          <Trash2 size={8} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
