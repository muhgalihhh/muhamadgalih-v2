export type SkillCategory = "design" | "development";
export type ProjectCategory = string; // dynamic — stored in project_categories table

export interface ProjectCategoryRow {
  id: string;
  slug: string;
  label: string;
  order_index: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  color_class: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  company_logo_url: string | null;
  company_logo_emoji: string;
  period: string;
  start_date: string | null;
  end_date: string | null;
  color_class: string;
  text_color_class: string;
  points: string[];
  order_index: number;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  period: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  images: string[];
  icon: string;
  logo_url: string | null;
  color_class: string;
  text_color_class: string;
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tech_stack: string[];
  emoji: string;
  color_class: string;
  text_color_class: string;
  image_urls: string[];
  link: string;
  project_date: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string;
  author_name: string;
  author_email: string | null;
  author_avatar: string | null;
  author_role: string | null;
  author_company: string | null;
  content: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  alias: string;
  email: string;
  location: string;
  availability: boolean;
  bio: string;
  github_url: string;
  dribbble_url: string;
  linkedin_url: string;
  instagram_url: string;
  music_url: string | null;
  spotify_embed_url: string | null;
  tagline: string | null;
  avatar_url: string | null;
  illustration_url: string | null;
  cv_url: string | null;
  hero_roles: string[];
  years_experience: number;
  clients_count: number;
  coffee_label: string;
}
