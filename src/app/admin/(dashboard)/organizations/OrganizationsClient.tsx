"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganization, updateOrganization, deleteOrganization, uploadFile } from "@/app/actions/admin";
import ColorPicker from "@/components/admin/ColorPicker";
import IconPicker from "@/components/admin/IconPicker";
import SkillIcon from "@/components/ui/SkillIcon";
import type { Organization } from "@/types/portfolio";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Users } from "lucide-react";

type FormMode = "add" | "edit" | null;

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-white";
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

function OrganizationForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<Organization>;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [logoUrl, setLogoUrl]     = useState(defaultValues?.logo_url ?? "");
  const [iconKey, setIconKey]     = useState(defaultValues?.icon ?? "");
  const [images, setImages]       = useState<string[]>(defaultValues?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "organizations");
      const res = await uploadFile(fd);
      if (res.url) newUrls.push(res.url);
    }
    setImages((p) => [...p, ...newUrls]);
    setGalleryUploading(false);
    e.target.value = "";
  };

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
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("images", images.join("\n"));
        onSubmit(fd);
      }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Organization Name *">
        <input name="name" required defaultValue={defaultValues?.name ?? ""} placeholder="e.g. Google Developer Student Club" className={inputCls} />
      </Field>
      <Field label="Role *">
        <input name="role" required defaultValue={defaultValues?.role ?? ""} placeholder="e.g. UI/UX Lead" className={inputCls} />
      </Field>
      <Field label="Period *">
        <input name="period" required defaultValue={defaultValues?.period ?? ""} placeholder="2022 · 2023" className={inputCls} />
      </Field>
      <Field label="Order">
        <input name="order_index" type="number" defaultValue={defaultValues?.order_index ?? 0} className={inputCls} />
      </Field>

      <Field label="Description — what you did there" wide>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="e.g. Led UI/UX workshops, mentored members, ran design sprints…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="Icon">
        <input type="hidden" name="icon" value={iconKey} />
        <IconPicker value={iconKey} onChange={setIconKey} placeholder="Search icons… (e.g. rocket, palette, code)" />
      </Field>

      <Field label="Logo (optional — overrides icon)">
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
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
              {uploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
              {uploading ? "Uploading..." : "Upload logo"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <input
              name="logo_url"
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

      <Field label="Gallery Photos — shown in the detail view" wide>
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors w-fit">
          {galleryUploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
          {galleryUploading ? "Uploading..." : "Upload photos"}
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={galleryUploading} />
        </label>
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
        <button type="submit" disabled={isPending || galleryUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Organization"}
        </button>
      </div>
    </form>
  );
}

export default function OrganizationsClient({ initialOrganizations }: { initialOrganizations: Organization[] }) {
  const [formMode, setFormMode]   = useState<FormMode>(null);
  const [editing, setEditing]     = useState<Organization | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg]             = useState("");

  const router = useRouter();
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (org: Organization) => { setEditing(org); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateOrganization(editing.id, fd)
        : await createOrganization(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this organization?")) return;
    startTransition(async () => { await deleteOrganization(id); reload(); });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialOrganizations.length} entries</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Organization
          </button>
        )}
      </div>

      {/* Form panel */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.name}"` : "New Organization"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <div className="p-6">
            <OrganizationForm defaultValues={editing ?? undefined} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </div>
      )}

      {/* List */}
      {initialOrganizations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <Users size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No organizations yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {initialOrganizations.map((org) => (
            <div key={org.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${editing?.id === org.id ? "bg-indigo-50/40" : ""}`}>
              {/* Color dot + icon */}
              <div className={`${org.color_class} w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border-2 border-black/5 shadow-sm overflow-hidden`}>
                {org.logo_url
                  ? <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                  : org.icon
                    ? <SkillIcon icon={org.icon} className="w-5 h-5 opacity-80" />
                    : <Users size={18} className="opacity-40" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{org.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{org.role} <span className="text-slate-300 mx-1">·</span> {org.period}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(org)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(org.id)}
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
