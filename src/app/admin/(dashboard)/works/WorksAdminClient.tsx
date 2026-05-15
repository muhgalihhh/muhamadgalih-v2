"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject, deleteProject, uploadFile, createCategory, deleteCategory } from "@/app/actions/admin";
import ColorPicker from "@/components/admin/ColorPicker";
import IconPicker from "@/components/admin/IconPicker";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Project, Skill, ProjectCategoryRow } from "@/types/portfolio";
import { Plus, Pencil, Trash2, X, Upload, Loader2, FolderOpen, ChevronDown, Tag } from "lucide-react";

type FormMode = "add" | "edit" | null;

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-white";
const Field = ({ label, children, wide, note }: { label: string; children: React.ReactNode; wide?: boolean; note?: string }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      {label}{note && <span className="ml-1 font-normal normal-case">{note}</span>}
    </label>
    {children}
  </div>
);

function TechStackPicker({ skills, selected, onChange }: { skills: Skill[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (name: string) => onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);

  if (skills.length === 0) {
    return (
      <p className="text-xs text-slate-400 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl">
        No skills in database yet — add some in the Skills section first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 p-3 border border-slate-200 rounded-xl bg-slate-50 min-h-[44px]">
        {skills.map((s) => {
          const active = selected.includes(s.name);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.name)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {s.icon && <SkillIcon icon={s.icon} className="w-3.5 h-3.5" />}
              {s.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => toggle(t)} className="text-indigo-400 hover:text-red-500 ml-0.5 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({ defaultValues, skills, categories, onSubmit, isPending }: {
  defaultValues?: Partial<Project>;
  skills: Skill[];
  categories: ProjectCategoryRow[];
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [imageUrls, setImageUrls]       = useState<string[]>(defaultValues?.image_urls ?? []);
  const [techStack, setTechStack]       = useState<string[]>(defaultValues?.tech_stack ?? []);
  const [icon, setIcon]                 = useState(defaultValues?.emoji ?? "");
  const [uploading, setUploading]       = useState(false);
  const [iconUploading, setIconUploading] = useState(false);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconUploading(true);
    const fd = new FormData();
    fd.append("file", file); fd.append("folder", "icons");
    const res = await uploadFile(fd);
    if (res.url) setIcon(res.url);
    setIconUploading(false);
    e.target.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file); fd.append("folder", "projects");
      const res = await uploadFile(fd);
      if (res.url) newUrls.push(res.url);
    }
    setImageUrls((p) => [...p, ...newUrls]);
    setUploading(false);
  };

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("image_urls", imageUrls.join("\n"));
        fd.set("tech_stack", techStack.join(","));
        fd.set("emoji", icon);
        onSubmit(fd);
      }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Title *">
        <input name="title" required defaultValue={defaultValues?.title ?? ""} className={inputCls} />
      </Field>

      <Field label="Category">
        <div className="relative">
          <select name="category" defaultValue={defaultValues?.category ?? (categories[0]?.slug ?? "software")} className={`${inputCls} appearance-none pr-8 w-full`}>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <Field label="Project Icon" wide>
        <IconPicker value={icon} onChange={setIcon} placeholder="Search icon... (e.g. react, figma, globe)" />
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">or upload custom</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-3.5 py-2 text-sm text-slate-600 transition-colors">
            {iconUploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
            {iconUploading ? "Uploading..." : "SVG / PNG"}
            <input type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" className="hidden" onChange={handleIconUpload} disabled={iconUploading} />
          </label>
          {icon && <SkillIcon icon={icon} className="w-6 h-6" />}
        </div>
      </Field>

      <Field label="Description" wide>
        <textarea name="description" rows={2} defaultValue={defaultValues?.description ?? ""} className={`${inputCls} resize-none`} />
      </Field>

      <Field label="Tech Stack" wide note="— select from your Skills database">
        <TechStackPicker skills={skills} selected={techStack} onChange={setTechStack} />
      </Field>

      <Field label="Project Link">
        <input name="link" defaultValue={defaultValues?.link ?? "#"} className={inputCls} />
      </Field>

      <Field label="Visibility">
        <div className="relative">
          <select name="published" defaultValue={String(defaultValues?.published ?? true)} className={`${inputCls} appearance-none pr-8 w-full`}>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <div className="col-span-2">
        <ColorPicker label="Card Color" nameBg="color_class" nameText="text_color_class" defaultBg={defaultValues?.color_class ?? "bg-violet"} />
      </div>

      <Field label="Screenshots" wide>
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
          {uploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
          {uploading ? "Uploading..." : "Upload screenshots"}
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {imageUrls.map((url) => (
              <div key={url} className="relative group w-20 h-20">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                <button
                  type="button"
                  onClick={() => setImageUrls((p) => p.filter((u) => u !== url))}
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
        <button type="submit" disabled={isPending || uploading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Project"}
        </button>
      </div>
    </form>
  );
}

export default function WorksAdminClient({ initialProjects, skills, initialCategories }: { initialProjects: Project[]; skills: Skill[]; initialCategories: ProjectCategoryRow[] }) {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editing, setEditing]   = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [catInput, setCatInput] = useState("");
  const [catMsg, setCatMsg]     = useState("");

  const router = useRouter();
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (p: Project) => { setEditing(p); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateProject(editing.id, fd)
        : await createProject(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;
    startTransition(async () => { await deleteProject(id); reload(); });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Works</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialProjects.length} projects</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Project
          </button>
        )}
      </div>

      {/* Categories panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <Tag size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Categories</span>
          <span className="ml-auto text-xs text-slate-400">{initialCategories.length} total</span>
        </div>
        <div className="p-4 flex flex-wrap gap-2 items-center">
          {initialCategories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-700">
              <span className="font-semibold">{cat.label}</span>
              <span className="text-slate-400 text-xs ml-1">/{cat.slug}</span>
              <button
                onClick={() => {
                  if (!confirm(`Delete category "${cat.label}"? Projects with this category won't be filtered.`)) return;
                  startTransition(async () => {
                    const res = await deleteCategory(cat.id);
                    if (res?.error) setCatMsg(res.error); else { setCatMsg(""); router.refresh(); }
                  });
                }}
                className="ml-1.5 text-slate-300 hover:text-red-400 transition-colors leading-none"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {/* Add new */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!catInput.trim()) return;
              const fd = new FormData();
              fd.append("label", catInput.trim());
              startTransition(async () => {
                const res = await createCategory(fd);
                if (res?.error) setCatMsg(res.error); else { setCatInput(""); setCatMsg(""); router.refresh(); }
              });
            }}
            className="flex items-center gap-2"
          >
            <input
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              placeholder="New category…"
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-white w-36"
            />
            <button type="submit" disabled={isPending || !catInput.trim()} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
              <Plus size={13} /> Add
            </button>
          </form>
        </div>
        {catMsg && <p className="mx-4 mb-3 text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{catMsg}</p>}
      </div>

      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.title}"` : "New Project"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <div className="p-6">
            <ProjectForm defaultValues={editing ?? undefined} skills={skills} categories={initialCategories} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </div>
      )}

      {initialProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <FolderOpen size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No projects yet — add your first one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {initialProjects.map((project) => (
            <div key={project.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${editing?.id === project.id ? "bg-indigo-50/40" : ""}`}>
              <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden border border-slate-100 shadow-sm">
                {project.image_urls[0] ? (
                  <img src={project.image_urls[0]} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`${project.color_class} w-full h-full flex items-center justify-center`}>
                    {project.emoji
                      ? <SkillIcon icon={project.emoji} className="w-6 h-6" />
                      : <span className="text-lg">✦</span>
                    }
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-slate-900 text-sm truncate">{project.title}</p>
                  {project.published
                    ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 shrink-0">LIVE</span>
                    : <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200 shrink-0">DRAFT</span>
                  }
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.tech_stack.slice(0, 5).map((t) => (
                    <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">{t}</span>
                  ))}
                  {project.tech_stack.length > 5 && <span className="text-[10px] text-slate-400">+{project.tech_stack.length - 5}</span>}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{project.category} · {project.image_urls.length} screenshots</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(project)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
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
