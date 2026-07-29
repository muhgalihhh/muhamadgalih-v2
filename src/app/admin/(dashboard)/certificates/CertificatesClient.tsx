"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, Upload, Loader2, Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { createCertificate, updateCertificate, deleteCertificate, uploadFile } from "@/app/actions/admin";
import type { Certificate } from "@/types/portfolio";
import PdfThumbnail from "@/components/admin/PdfThumbnail";

type FormMode = "add" | "edit" | null;

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition bg-white";
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

function CertificateForm({ defaultValues, onSubmit, isPending }: {
  defaultValues?: Partial<Certificate>;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file); fd.append("folder", "certificates");
    const res = await uploadFile(fd);
    if (res.url) setImageUrl(res.url);
    setUploading(false);
  };

  return (
    <form
      key={defaultValues?.id ?? "new"}
      onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); fd.set("image_url", imageUrl); onSubmit(fd); }}
      className="grid grid-cols-2 gap-5"
    >
      <Field label="Title *">
        <input name="title" required defaultValue={defaultValues?.title ?? ""} className={inputCls} />
      </Field>
      <Field label="Issuer *">
        <input name="issuer" required defaultValue={defaultValues?.issuer ?? ""} placeholder="e.g. Coursera, Google" className={inputCls} />
      </Field>
      <Field label="Issue Date">
        <input name="issue_date" type="date" defaultValue={defaultValues?.issue_date ?? ""} className={inputCls} />
      </Field>
      <Field label="Credential URL">
        <input name="credential_url" type="url" defaultValue={defaultValues?.credential_url ?? ""} placeholder="https://..." className={inputCls} />
      </Field>

      <Field label="Certificate Image or PDF" wide>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-violet/30 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors">
            {uploading ? <Loader2 size={13} className="animate-spin text-violet" /> : <Upload size={13} className="text-slate-400" />}
            {uploading ? "Uploading..." : "Upload image or PDF"}
            <input type="file" accept="image/*,application/pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          {imageUrl && (
            <div className="relative shrink-0">
              {imageUrl.toLowerCase().endsWith(".pdf") ? (
                <PdfThumbnail url={imageUrl} className="w-16 h-10 rounded-lg border border-slate-200" />
              ) : (
                <img src={imageUrl} alt="preview" className="w-16 h-10 object-cover rounded-lg border border-slate-200" />
              )}
              <button
                type="button"
                onClick={() => setImageUrl("")}
                title="Remove file"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
              >
                <X size={11} />
              </button>
            </div>
          )}
        </div>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image/PDF URL" className={`${inputCls} mt-1`} />
      </Field>

      <div className="col-span-2 pt-4 border-t border-slate-100 flex gap-2">
        <button type="submit" disabled={isPending || uploading} className="bg-violet hover:brightness-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
          {isPending ? "Saving..." : defaultValues?.id ? "Save Changes" : "Add Certificate"}
        </button>
      </div>
    </form>
  );
}

export default function CertificatesClient({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editing, setEditing]   = useState<Certificate | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const router = useRouter();
  const reload   = () => { close(); router.refresh(); };
  const close    = () => { setFormMode(null); setEditing(null); setMsg(""); };
  const openEdit = (c: Certificate) => { setEditing(c); setFormMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAdd  = () => { setEditing(null); setFormMode("add"); };

  const handleSubmit = (fd: FormData) => {
    startTransition(async () => {
      const res = formMode === "edit" && editing
        ? await updateCertificate(editing.id, fd)
        : await createCertificate(fd);
      if (res?.error) setMsg(res.error);
      else reload();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    startTransition(async () => { await deleteCertificate(id); reload(); });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Certificates</h1>
          <p className="text-slate-400 text-sm mt-0.5">{initialCertificates.length} certificates</p>
        </div>
        {!formMode && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-violet hover:brightness-90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Certificate
          </button>
        )}
      </div>

      {/* Form panel */}
      {formMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">
              {formMode === "edit" ? `Edit "${editing?.title}"` : "New Certificate"}
            </span>
            <button onClick={close} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X size={15} />
            </button>
          </div>
          {msg && <p className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{msg}</p>}
          <div className="p-6">
            <CertificateForm defaultValues={editing ?? undefined} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </div>
      )}

      {/* Grid */}
      {initialCertificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          <Award size={36} className="mx-auto mb-3 opacity-20" strokeWidth={1.2} />
          <p className="text-sm">No certificates yet — add your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialCertificates.map((cert) => (
            <div key={cert.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group flex flex-col ${editing?.id === cert.id ? "ring-2 ring-violet ring-offset-1" : ""}`}>
              {cert.image_url && cert.image_url.toLowerCase().endsWith(".pdf") ? (
                <PdfThumbnail url={cert.image_url} className="w-full h-32" />
              ) : cert.image_url ? (
                <img src={cert.image_url} alt={cert.title} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-slate-50 to-violet/10 flex items-center justify-center">
                  <Award size={44} className="text-violet/30" strokeWidth={1} />
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <p className="font-semibold text-slate-900 text-sm leading-snug">{cert.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(cert.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-auto pt-3">
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-violet text-xs font-semibold hover:underline">
                      <ExternalLink size={10} /> View
                    </a>
                  )}
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => openEdit(cert)} className="p-1.5 rounded-lg text-slate-400 hover:text-violet hover:bg-violet/10 transition-colors" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
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
  );
}
