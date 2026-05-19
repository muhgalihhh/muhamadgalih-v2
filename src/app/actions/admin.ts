"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import type { Profile, GalleryItem, ProjectCategoryRow, ContactMessage } from "@/types/portfolio";

// ── Storage cleanup helpers ──────────────────────────────────
const STORAGE_MARKER = "/storage/v1/object/public/portfolio/";

function extractStoragePath(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const idx = url.indexOf(STORAGE_MARKER);
  if (idx === -1) return null;
  return url.slice(idx + STORAGE_MARKER.length).split("?")[0];
}

async function deleteStorageFiles(urls: (string | null | undefined)[]) {
  const paths = urls
    .map(extractStoragePath)
    .filter((p): p is string => !!p);
  if (paths.length === 0) return;
  try {
    const supabase = await createClient();
    await supabase.storage.from("portfolio").remove(paths);
  } catch {
    // Storage cleanup is best-effort — never fail the main operation
  }
}

// ── Auth ─────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}

// ── Skills ───────────────────────────────────────────────────
export async function getAdminSkills() {
  const supabase = await createClient();
  const { data } = await supabase.from("skills").select("*").order("order_index");
  return data ?? [];
}

export async function createSkill(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert({
    name:        formData.get("name") as string,
    category:    formData.get("category") as string,
    color_class: formData.get("color_class") as string,
    icon:        formData.get("icon") as string,
  });
  revalidatePath("/admin/(dashboard)/skills");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient();
  const newIcon = formData.get("icon") as string;

  const { data: old } = await supabase.from("skills").select("icon").eq("id", id).single();

  const { error } = await supabase.from("skills").update({
    name:        formData.get("name") as string,
    category:    formData.get("category") as string,
    color_class: formData.get("color_class") as string,
    icon:        newIcon,
  }).eq("id", id);

  if (!error && old?.icon && old.icon !== newIcon) {
    await deleteStorageFiles([old.icon]);
  }
  revalidatePath("/admin/(dashboard)/skills");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { data: old } = await supabase.from("skills").select("icon").eq("id", id).single();
  await supabase.from("skills").delete().eq("id", id);
  if (old) await deleteStorageFiles([old.icon]);
  revalidatePath("/admin/(dashboard)/skills");
  revalidatePath("/about");
}

// ── Experiences ──────────────────────────────────────────────
export async function getAdminExperiences() {
  const supabase = await createClient();
  const { data } = await supabase.from("experiences").select("*").order("order_index");
  return data ?? [];
}

export async function createExperience(formData: FormData) {
  const supabase = await createClient();
  const pointsRaw = formData.get("points") as string;
  const points = pointsRaw.split("\n").map((p) => p.trim()).filter(Boolean);
  const { error } = await supabase.from("experiences").insert({
    role:                formData.get("role") as string,
    company:             formData.get("company") as string,
    company_logo_emoji:  (formData.get("company_logo_emoji") as string) || "",
    company_logo_url:    (formData.get("company_logo_url") as string) || null,
    period:              formData.get("period") as string,
    color_class:         formData.get("color_class") as string,
    text_color_class:    formData.get("text_color_class") as string,
    points,
  });
  revalidatePath("/admin/(dashboard)/experience");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient();
  const pointsRaw = formData.get("points") as string;
  const points = pointsRaw.split("\n").map((p) => p.trim()).filter(Boolean);
  const newLogo = (formData.get("company_logo_url") as string) || null;

  const { data: old } = await supabase.from("experiences").select("company_logo_url").eq("id", id).single();

  const { error } = await supabase.from("experiences").update({
    role:                formData.get("role") as string,
    company:             formData.get("company") as string,
    company_logo_emoji:  (formData.get("company_logo_emoji") as string) || "",
    company_logo_url:    newLogo,
    period:              formData.get("period") as string,
    color_class:         formData.get("color_class") as string,
    text_color_class:    formData.get("text_color_class") as string,
    points,
  }).eq("id", id);

  if (!error && old?.company_logo_url && old.company_logo_url !== newLogo) {
    await deleteStorageFiles([old.company_logo_url]);
  }
  revalidatePath("/admin/(dashboard)/experience");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { data: old } = await supabase.from("experiences").select("company_logo_url").eq("id", id).single();
  await supabase.from("experiences").delete().eq("id", id);
  if (old) await deleteStorageFiles([old.company_logo_url]);
  revalidatePath("/admin/(dashboard)/experience");
  revalidatePath("/about");
}

// ── Projects ─────────────────────────────────────────────────
export async function getAdminProjects() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("order_index");
  return data ?? [];
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const techRaw = formData.get("tech_stack") as string;
  const tech_stack = techRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const imageRaw = formData.get("image_urls") as string;
  const image_urls = imageRaw.split("\n").map((u) => u.trim()).filter(Boolean);
  const { error } = await supabase.from("projects").insert({
    title:            formData.get("title") as string,
    category:         formData.get("category") as string,
    description:      formData.get("description") as string,
    emoji:            formData.get("emoji") as string,
    color_class:      formData.get("color_class") as string,
    text_color_class: formData.get("text_color_class") as string,
    link:             formData.get("link") as string,
    published:        formData.get("published") === "true",
    tech_stack,
    image_urls,
  });
  revalidatePath("/admin/(dashboard)/works");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const techRaw = formData.get("tech_stack") as string;
  const tech_stack = techRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const imageRaw = formData.get("image_urls") as string;
  const image_urls = imageRaw.split("\n").map((u) => u.trim()).filter(Boolean);
  const newEmoji = formData.get("emoji") as string;

  const { data: old } = await supabase.from("projects").select("image_urls, emoji").eq("id", id).single();

  const { error } = await supabase.from("projects").update({
    title:            formData.get("title") as string,
    category:         formData.get("category") as string,
    description:      formData.get("description") as string,
    emoji:            newEmoji,
    color_class:      formData.get("color_class") as string,
    text_color_class: formData.get("text_color_class") as string,
    link:             formData.get("link") as string,
    published:        formData.get("published") === "true",
    tech_stack,
    image_urls,
  }).eq("id", id);

  if (!error && old) {
    const removed: (string | null)[] = (old.image_urls ?? []).filter(
      (u: string) => !image_urls.includes(u)
    );
    if (old.emoji && old.emoji !== newEmoji) removed.push(old.emoji);
    await deleteStorageFiles(removed);
  }
  revalidatePath("/admin/(dashboard)/works");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: old } = await supabase.from("projects").select("image_urls, emoji").eq("id", id).single();
  await supabase.from("projects").delete().eq("id", id);
  if (old) await deleteStorageFiles([...(old.image_urls ?? []), old.emoji]);
  revalidatePath("/admin/(dashboard)/works");
  revalidatePath("/works");
}

// ── Certificates ─────────────────────────────────────────────
export async function getAdminCertificates() {
  const supabase = await createClient();
  const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function createCertificate(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").insert({
    title:          formData.get("title") as string,
    issuer:         formData.get("issuer") as string,
    issue_date:     (formData.get("issue_date") as string) || null,
    credential_url: (formData.get("credential_url") as string) || null,
    image_url:      (formData.get("image_url") as string) || null,
  });
  revalidatePath("/admin/(dashboard)/certificates");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateCertificate(id: string, formData: FormData) {
  const supabase = await createClient();
  const newImg = (formData.get("image_url") as string) || null;

  const { data: old } = await supabase.from("certificates").select("image_url").eq("id", id).single();

  const { error } = await supabase.from("certificates").update({
    title:          formData.get("title") as string,
    issuer:         formData.get("issuer") as string,
    issue_date:     (formData.get("issue_date") as string) || null,
    credential_url: (formData.get("credential_url") as string) || null,
    image_url:      newImg,
  }).eq("id", id);

  if (!error && old?.image_url && old.image_url !== newImg) {
    await deleteStorageFiles([old.image_url]);
  }
  revalidatePath("/admin/(dashboard)/certificates");
  revalidatePath("/about");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  const { data: old } = await supabase.from("certificates").select("image_url").eq("id", id).single();
  await supabase.from("certificates").delete().eq("id", id);
  if (old) await deleteStorageFiles([old.image_url]);
  revalidatePath("/admin/(dashboard)/certificates");
  revalidatePath("/about");
}

// ── Profile ──────────────────────────────────────────────────
export async function getAdminProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").single();
  return (data as Profile) ?? null;
}

export async function updateProfile(id: string, formData: FormData) {
  const supabase = await createClient();
  const newAvatar       = (formData.get("avatar_url") as string) || null;
  const newIllustration = (formData.get("illustration_url") as string) || null;
  const newMusic        = (formData.get("music_url") as string) || null;
  const newCv           = (formData.get("cv_url") as string) || null;

  const heroRolesRaw = (formData.get("hero_roles") as string) || "";
  const hero_roles = heroRolesRaw.split("\n").map((r) => r.trim()).filter(Boolean);

  const { data: old } = await supabase
    .from("profile")
    .select("avatar_url, illustration_url, music_url, cv_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("profile").update({
    name:               formData.get("name") as string,
    alias:              formData.get("alias") as string,
    email:              formData.get("email") as string,
    location:           formData.get("location") as string,
    availability:       formData.get("availability") === "true",
    bio:                formData.get("bio") as string,
    github_url:         formData.get("github_url") as string,
    dribbble_url:       formData.get("dribbble_url") as string,
    linkedin_url:       formData.get("linkedin_url") as string,
    instagram_url:      formData.get("instagram_url") as string,
    music_url:          newMusic,
    spotify_embed_url:  (formData.get("spotify_embed_url") as string) || null,
    tagline:            (formData.get("tagline") as string) || null,
    avatar_url:         newAvatar,
    illustration_url:   newIllustration,
    cv_url:             newCv,
    hero_roles:         hero_roles.length > 0 ? hero_roles : ["Full-Stack Engineering", "UI/UX Design", "Illustration & Art"],
    years_experience:   parseInt((formData.get("years_experience") as string) || "0", 10),
    clients_count:      parseInt((formData.get("clients_count") as string) || "0", 10),
    coffee_label:       (formData.get("coffee_label") as string) || "∞",
  }).eq("id", id);

  if (!error && old) {
    const removed: (string | null)[] = [];
    if (old.avatar_url       && old.avatar_url       !== newAvatar)       removed.push(old.avatar_url);
    if (old.illustration_url && old.illustration_url !== newIllustration) removed.push(old.illustration_url);
    if (old.music_url        && old.music_url        !== newMusic)        removed.push(old.music_url);
    if (old.cv_url           && old.cv_url           !== newCv)           removed.push(old.cv_url);
    await deleteStorageFiles(removed);
  }
  revalidatePath("/admin/(dashboard)/contact");
  revalidatePath("/contact");
  revalidatePath("/");
  if (error) return { error: error.message };
  return { ok: true };
}

// ── Gallery ───────────────────────────────────────────────────
export async function getAdminGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
  return (data as GalleryItem[]) ?? [];
}

export async function createGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").insert({
    title:       (formData.get("title") as string) || "",
    description: (formData.get("description") as string) || "",
    category:    (formData.get("category") as string) || "illustration",
    image_url:   formData.get("image_url") as string,
    sort_order:  parseInt((formData.get("sort_order") as string) || "0", 10),
    published:   formData.get("published") === "true",
  });
  revalidatePath("/admin/(dashboard)/gallery");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const newImg = formData.get("image_url") as string;

  const { data: old } = await supabase.from("gallery_items").select("image_url").eq("id", id).single();

  const { error } = await supabase.from("gallery_items").update({
    title:       (formData.get("title") as string) || "",
    description: (formData.get("description") as string) || "",
    category:    (formData.get("category") as string) || "illustration",
    image_url:   newImg,
    sort_order:  parseInt((formData.get("sort_order") as string) || "0", 10),
    published:   formData.get("published") === "true",
  }).eq("id", id);

  if (!error && old?.image_url && old.image_url !== newImg) {
    await deleteStorageFiles([old.image_url]);
  }
  revalidatePath("/admin/(dashboard)/gallery");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { data: old } = await supabase.from("gallery_items").select("image_url").eq("id", id).single();
  await supabase.from("gallery_items").delete().eq("id", id);
  if (old) await deleteStorageFiles([old.image_url]);
  revalidatePath("/admin/(dashboard)/gallery");
  revalidatePath("/works");
}

// ── Project categories ────────────────────────────────────────
export async function getAdminCategories(): Promise<ProjectCategoryRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("project_categories").select("*").order("order_index");
  return (data ?? []) as ProjectCategoryRow[];
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const label = (formData.get("label") as string).trim();
  const slug  = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const { data: last } = await supabase.from("project_categories").select("order_index").order("order_index", { ascending: false }).limit(1).single();
  const order_index = last ? (last.order_index as number) + 1 : 0;
  const { error } = await supabase.from("project_categories").insert({ slug, label, order_index });
  revalidatePath("/admin/(dashboard)/works");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  revalidatePath("/admin/(dashboard)/works");
  revalidatePath("/works");
  if (error) return { error: error.message };
  return { ok: true };
}

// ── File upload (storage) ─────────────────────────────────────
export async function uploadFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "misc";
  if (!file || file.size === 0) return { error: "No file provided" };
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) return { error: error.message };
  const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(path);
  return { url: publicUrl };
}

// ── Contact messages (inbox) ──────────────────────────────────
export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function markMessageRead(id: string) {
  const supabase = createServiceClient();
  await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = createServiceClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
