"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import type { Testimonial } from "@/types/portfolio";

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getOwnTestimonial(): Promise<Testimonial | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data ?? null;
}

export async function submitTestimonial(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in with Google first." };

  const content        = (formData.get("content")        as string)?.trim();
  const rating         = parseInt(formData.get("rating")  as string) || 5;
  const author_role    = (formData.get("author_role")    as string)?.trim() || null;
  const author_company = (formData.get("author_company") as string)?.trim() || null;

  if (!content) return { error: "Testimonial message is required." };

  const payload = {
    user_id:        user.id,
    author_name:    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Anonymous",
    author_email:   user.email ?? null,
    author_avatar:  user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    author_role,
    author_company,
    content,
    rating,
    approved:       false,
  };

  // Upsert so the user can update their pending testimonial
  const { error } = await supabase
    .from("testimonials")
    .upsert(payload, { onConflict: "user_id" });

  if (error) return { error: "Failed to submit testimonial. Please try again." };
  revalidatePath("/");
  return { ok: true };
}

// ── Admin-only (uses service role — bypasses RLS) ──────────────
export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function approveTestimonial(id: string) {
  const supabase = createServiceClient();
  await supabase.from("testimonials").update({ approved: true }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function rejectTestimonial(id: string) {
  const supabase = createServiceClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
}

export async function markContactMessageRead(id: string) {
  const supabase = createServiceClient();
  await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  revalidatePath("/admin/messages");
}
