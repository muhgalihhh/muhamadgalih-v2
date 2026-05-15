"use client";

import { useState, useTransition } from "react";
import { updateProfile, uploadFile } from "@/app/actions/admin";
import { Upload, Loader2, CheckCircle, Music, ExternalLink, Image, X } from "lucide-react";
import type { Profile } from "@/types/portfolio";

const inputCls = "border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-white";
const labelCls = "text-[11px] font-semibold uppercase tracking-widest text-slate-400";

const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

function extractSpotifyUrl(input: string): string {
  const match = input.match(/src="([^"]+)"/);
  if (match) return match[1];
  return input.trim();
}

export default function ContactAdminClient({ profile }: { profile: Profile | null }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [musicUrl, setMusicUrl]             = useState(profile?.music_url ?? "");
  const [musicUploading, setMusicUploading] = useState(false);
  const [musicUploadMsg, setMusicUploadMsg] = useState("");

  const [spotifyInput, setSpotifyInput] = useState(profile?.spotify_embed_url ?? "");

  const [avatarUrl, setAvatarUrl]                         = useState(profile?.avatar_url ?? "");
  const [avatarUploading, setAvatarUploading]             = useState(false);
  const [illustrationUrl, setIllustrationUrl]             = useState(profile?.illustration_url ?? "");
  const [illustrationUploading, setIllustrationUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.set("file", file); fd.set("folder", "avatars");
    const res = await uploadFile(fd);
    if (res.url) setAvatarUrl(res.url);
    setAvatarUploading(false);
    e.target.value = "";
  };

  const handleIllustrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIllustrationUploading(true);
    const fd = new FormData();
    fd.set("file", file); fd.set("folder", "avatars");
    const res = await uploadFile(fd);
    if (res.url) setIllustrationUrl(res.url);
    setIllustrationUploading(false);
    e.target.value = "";
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicUploading(true);
    setMusicUploadMsg("");
    const fd = new FormData();
    fd.set("file", file); fd.set("folder", "music");
    const res = await uploadFile(fd);
    if (res.url) {
      setMusicUrl(res.url);
      setMusicUploadMsg("Uploaded! Save profile to apply.");
    } else {
      setMusicUploadMsg(res.error ?? "Upload failed");
    }
    setMusicUploading(false);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    const fd = new FormData(e.currentTarget);
    fd.set("music_url", musicUrl);
    fd.set("spotify_embed_url", extractSpotifyUrl(spotifyInput));
    fd.set("avatar_url", avatarUrl);
    fd.set("illustration_url", illustrationUrl);
    setMsg(""); setSuccess(false);
    startTransition(async () => {
      const res = await updateProfile(profile.id, fd);
      if (res?.error) setMsg(res.error);
      else setSuccess(true);
    });
  };

  if (!profile) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Contact / Profile</h1>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-slate-500 text-sm">
          <p className="font-semibold text-slate-700 mb-1">No profile found in database.</p>
          <p>Run the SQL migration and insert a row into the <code className="bg-slate-100 px-1 rounded text-xs">profile</code> table first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Contact / Profile</h1>
        <p className="text-slate-400 text-sm mt-0.5">Edit your public contact info, social links, and media</p>
      </div>

      {msg && (
        <p className="text-red-600 text-sm mb-5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{msg}</p>
      )}
      {success && (
        <p className="text-green-700 text-sm mb-5 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
          <CheckCircle size={14} /> Profile updated successfully.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Basic Info</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-5">
            <Field label="Name *">
              <input name="name" required defaultValue={profile.name} className={inputCls} />
            </Field>
            <Field label="Alias / Artist Name">
              <input name="alias" defaultValue={profile.alias ?? ""} placeholder="MIZARIE" className={inputCls} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" defaultValue={profile.email ?? ""} className={inputCls} />
            </Field>
            <Field label="Location">
              <input name="location" defaultValue={profile.location ?? ""} placeholder="Indonesia" className={inputCls} />
            </Field>
            <Field label="Availability">
              <select name="availability" defaultValue={String(profile.availability ?? true)} className={`${inputCls} appearance-none`}>
                <option value="true">Open for opportunities</option>
                <option value="false">Not available</option>
              </select>
            </Field>
            <Field label="Hero Tagline">
              <input name="tagline" defaultValue={profile.tagline ?? ""} placeholder="aka ✦ MIZARIE ✦" className={inputCls} />
            </Field>
            <Field label="Bio" wide>
              <textarea name="bio" rows={3} defaultValue={profile.bio ?? ""} className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </div>

        {/* Hero Roles & About Stats */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Hero Roles &amp; About Stats</span>
            <p className="text-slate-400 text-xs mt-0.5">Running text di hero & angka stats di section About (home page).</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-5">
            <Field label="Hero Roles (1 per baris)" wide>
              <textarea
                name="hero_roles"
                rows={4}
                defaultValue={(profile.hero_roles ?? []).join("\n")}
                placeholder={`Full-Stack Engineering\nUI/UX Design\nIllustration & Art`}
                className={`${inputCls} resize-none font-mono text-xs`}
              />
              <span className="text-[11px] text-slate-400">Dipakai untuk cycling text & role pills di hero. Tiap baris = satu role.</span>
            </Field>

            <Field label="Years of Experience">
              <input
                name="years_experience"
                type="number"
                min={0}
                defaultValue={profile.years_experience ?? 3}
                className={inputCls}
              />
            </Field>

            <Field label="Happy Clients">
              <input
                name="clients_count"
                type="number"
                min={0}
                defaultValue={profile.clients_count ?? 2}
                className={inputCls}
              />
            </Field>

            <Field label="Coffee Label" wide>
              <input
                name="coffee_label"
                defaultValue={profile.coffee_label ?? "∞"}
                placeholder="∞ atau 1000+"
                className={inputCls}
              />
              <span className="text-[11px] text-slate-400">Boleh angka atau simbol seperti ∞. Projects Shipped auto-hitung dari DB.</span>
            </Field>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Profile Photo</span>
          </div>
          <div className="p-6 flex items-start gap-5">
            <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : <Image size={28} className="text-slate-300" />
              }
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors">
                  {avatarUploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
                  {avatarUploading ? "Uploading..." : "Upload photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                </label>
                {avatarUrl && (
                  <a href={avatarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                    <ExternalLink size={11} /> View
                  </a>
                )}
                {avatarUrl && (
                  <button type="button" onClick={() => setAvatarUrl("")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                    <X size={11} /> Remove
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Or paste a direct image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Illustration Avatar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Illustration / Avatar</span>
            <p className="text-slate-400 text-xs mt-0.5">Versi ilustrasi foto — akan bergantian tampil di hero section.</p>
          </div>
          <div className="p-6 flex items-start gap-5">
            <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
              {illustrationUrl
                ? <img src={illustrationUrl} alt="illustration" className="w-full h-full object-cover" />
                : <Image size={28} className="text-slate-300" />
              }
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors">
                  {illustrationUploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
                  {illustrationUploading ? "Uploading..." : "Upload illustration"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleIllustrationUpload} disabled={illustrationUploading} />
                </label>
                {illustrationUrl && (
                  <a href={illustrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                    <ExternalLink size={11} /> View
                  </a>
                )}
                {illustrationUrl && (
                  <button type="button" onClick={() => setIllustrationUrl("")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                    <X size={11} /> Remove
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Or paste a direct image URL</label>
                <input
                  type="url"
                  value={illustrationUrl}
                  onChange={(e) => setIllustrationUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Social Links</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-5">
            <Field label="GitHub URL">
              <input name="github_url" defaultValue={profile.github_url ?? ""} placeholder="https://github.com/username" className={inputCls} />
            </Field>
            <Field label="Dribbble URL">
              <input name="dribbble_url" defaultValue={profile.dribbble_url ?? ""} placeholder="https://dribbble.com/username" className={inputCls} />
            </Field>
            <Field label="LinkedIn URL">
              <input name="linkedin_url" defaultValue={profile.linkedin_url ?? ""} placeholder="https://linkedin.com/in/username" className={inputCls} />
            </Field>
            <Field label="Instagram URL">
              <input name="instagram_url" defaultValue={profile.instagram_url ?? ""} placeholder="https://instagram.com/username" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Music & Media */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <span className="text-sm font-semibold text-slate-700">Music &amp; Media</span>
          </div>
          <div className="p-6 space-y-6">

            {/* Background Music */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Music size={13} className="text-indigo-500" /> Background Music
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Upload an audio file — plays in the floating music player on the public site.</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors">
                  {musicUploading ? <Loader2 size={13} className="animate-spin text-indigo-500" /> : <Upload size={13} className="text-slate-400" />}
                  {musicUploading ? "Uploading..." : "Choose audio file"}
                  <input type="file" accept="audio/*" className="hidden" onChange={handleMusicUpload} disabled={musicUploading} />
                </label>
                {musicUrl && (
                  <a href={musicUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                    <ExternalLink size={11} /> Current file
                  </a>
                )}
              </div>
              {musicUploadMsg && (
                <p className={`text-xs ${musicUploadMsg.startsWith("Uploaded") ? "text-green-600" : "text-red-500"}`}>
                  {musicUploadMsg}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Or paste a direct audio URL</label>
                <input type="url" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="https://..." className={inputCls} />
              </div>
            </div>

            {/* Spotify Embed */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">Spotify Embed</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  In Spotify: Share → Embed → Copy. Paste the full <code className="bg-slate-100 px-1 rounded text-[11px]">&lt;iframe&gt;</code> code or just the embed URL.
                </p>
              </div>
              <textarea
                rows={4}
                value={spotifyInput}
                onChange={(e) => setSpotifyInput(e.target.value)}
                placeholder={`<iframe src="https://open.spotify.com/embed/track/..." ...></iframe>\nor just: https://open.spotify.com/embed/track/...`}
                className={`${inputCls} w-full font-mono text-xs resize-none`}
              />
              {spotifyInput && extractSpotifyUrl(spotifyInput) !== spotifyInput && (
                <p className="text-xs text-slate-400">
                  Extracted URL: <span className="text-indigo-600 break-all">{extractSpotifyUrl(spotifyInput)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
