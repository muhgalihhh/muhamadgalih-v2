import { createClient } from "@/lib/supabase/server";
import type { Skill, Experience, Organization, Project, Certificate, Profile, GalleryItem, ProjectCategoryRow } from "@/types/portfolio";

export async function getPublicProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data?.length) return [];
    return data as Project[];
  } catch {
    return [];
  }
}

export async function getPublicExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("order_index");
    if (error || !data?.length) return [];
    return data as Experience[];
  } catch {
    return [];
  }
}

export async function getPublicOrganizations(): Promise<Organization[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("order_index");
    if (error || !data?.length) return [];
    return data as Organization[];
  } catch {
    return [];
  }
}

export async function getPublicSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index");
    if (error || !data?.length) return [];
    return data as Skill[];
  } catch {
    return [];
  }
}

export async function getPublicCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data?.length) return [];
    return data as Certificate[];
  } catch {
    return [];
  }
}

export async function getPublicGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error || !data?.length) return [];
    return data as GalleryItem[];
  } catch {
    return [];
  }
}

export async function getPublicCategories(): Promise<ProjectCategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .select("*")
      .order("order_index");
    if (error || !data?.length) return [];
    return data as ProjectCategoryRow[];
  } catch {
    return [];
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .single();
    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
}
