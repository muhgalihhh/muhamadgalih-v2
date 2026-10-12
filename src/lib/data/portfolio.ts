import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Skill, Experience, Education, Organization, Project, ProjectSummary, Certificate, Profile, GalleryItem, ProjectCategoryRow } from "@/types/portfolio";

// Everything but `content`: list pages pass these rows to client components,
// and every project's full rich content would otherwise ride along.
const PROJECT_SUMMARY_COLUMNS =
  "id, slug, title, category, description, tech_stack, emoji, color_class, text_color_class, image_urls, link, links, project_date, order_index, published, created_at, experience_id";

export async function getPublicProjects(): Promise<ProjectSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_SUMMARY_COLUMNS)
      .eq("published", true)
      .order("project_date", { ascending: false, nullsFirst: false })
      .order("order_index");
    if (error || !data?.length) return [];
    return data as ProjectSummary[];
  } catch {
    return [];
  }
}

export type ProjectWithExperience = Project & { experience: { role: string; company: string } | null };

// cache(): generateMetadata and the page both call this in one request.
export const getPublicProjectBySlug = cache(async (slug: string): Promise<ProjectWithExperience | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, experience:experiences(role, company)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as ProjectWithExperience;
  } catch {
    return null;
  }
});

export async function getPublicExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("end_date", { ascending: false, nullsFirst: true })
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("order_index");
    if (error || !data?.length) return [];

    const { data: linkedProjects } = await supabase
      .from("projects")
      .select("id, slug, title, category, description, color_class, text_color_class, tech_stack, image_urls, emoji, links, experience_id")
      .eq("published", true)
      .not("experience_id", "is", null);

    return data.map((exp) => ({
      ...exp,
      linked_projects: (linkedProjects ?? [])
        .filter((p) => p.experience_id === exp.id)
        .map((p) => ({
          id: p.id, slug: p.slug, title: p.title, category: p.category, description: p.description,
          color_class: p.color_class, text_color_class: p.text_color_class,
          tech_stack: p.tech_stack, image_urls: p.image_urls, emoji: p.emoji, links: p.links,
        })),
    })) as Experience[];
  } catch {
    return [];
  }
}

export async function getPublicEducation(): Promise<Education[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("end_date", { ascending: false, nullsFirst: true })
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("order_index");
    if (error || !data?.length) return [];
    return data as Education[];
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
      .order("end_date", { ascending: false, nullsFirst: true })
      .order("start_date", { ascending: false, nullsFirst: false })
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
      .order("issue_date", { ascending: false, nullsFirst: false })
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

    const [{ data: manualItems }, { data: galleryCategories }] = await Promise.all([
      supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .order("sort_order")
        .order("created_at", { ascending: false }),
      supabase.from("project_categories").select("slug").eq("show_in_gallery", true),
    ]);

    const gallerySlugs = (galleryCategories ?? []).map((c) => c.slug);
    let derivedItems: GalleryItem[] = [];

    if (gallerySlugs.length > 0) {
      const { data: works } = await supabase
        .from("projects")
        .select("id, slug, title, description, category, image_urls, project_date, order_index, created_at")
        .eq("published", true)
        .in("category", gallerySlugs)
        .order("project_date", { ascending: false, nullsFirst: false })
        .order("order_index");

      derivedItems = (works ?? [])
        .filter((w) => w.image_urls?.length > 0)
        .map((w) => ({
          id: w.id,
          slug: w.slug,
          title: w.title,
          description: w.description,
          category: w.category,
          image_urls: w.image_urls,
          sort_order: w.order_index,
          published: true,
          created_at: w.created_at,
        }));
    }

    return [...derivedItems, ...(manualItems as GalleryItem[] ?? [])];
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
