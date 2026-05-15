-- ============================================================
-- Portfolio CMS Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Skills / Technologies
CREATE TABLE IF NOT EXISTS skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  category      text NOT NULL DEFAULT 'development', -- 'design' | 'development'
  color_class   text NOT NULL DEFAULT 'bg-violet text-cream',
  icon          text NOT NULL DEFAULT '⚡',
  order_index   int  NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Work Experience
CREATE TABLE IF NOT EXISTS experiences (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role                text NOT NULL,
  company             text NOT NULL,
  company_logo_url    text,
  company_logo_emoji  text NOT NULL DEFAULT '🏢',
  period              text NOT NULL,
  color_class         text NOT NULL DEFAULT 'bg-violet',
  text_color_class    text NOT NULL DEFAULT 'text-cream',
  points              text[] NOT NULL DEFAULT '{}',
  order_index         int  NOT NULL DEFAULT 0,
  created_at          timestamptz DEFAULT now()
);

-- Projects / Works
CREATE TABLE IF NOT EXISTS projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  category         text NOT NULL DEFAULT 'software', -- 'software' | 'uiux' | 'illustration'
  description      text NOT NULL DEFAULT '',
  tech_stack       text[] NOT NULL DEFAULT '{}',
  emoji            text NOT NULL DEFAULT '⚡',
  color_class      text NOT NULL DEFAULT 'bg-violet',
  text_color_class text NOT NULL DEFAULT 'text-cream',
  image_urls       text[] NOT NULL DEFAULT '{}',
  link             text NOT NULL DEFAULT '#',
  order_index      int  NOT NULL DEFAULT 0,
  published        boolean NOT NULL DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  issuer         text NOT NULL,
  issue_date     text,
  credential_url text,
  image_url      text,
  created_at     timestamptz DEFAULT now()
);

-- Profile / Contact (singleton — always one row)
CREATE TABLE IF NOT EXISTS profile (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL DEFAULT 'Muhamad Galih',
  alias        text NOT NULL DEFAULT 'MIZARIE',
  email        text NOT NULL DEFAULT 'galihslank79@gmail.com',
  location     text NOT NULL DEFAULT 'Indonesia',
  availability boolean NOT NULL DEFAULT true,
  bio          text NOT NULL DEFAULT '',
  github_url   text NOT NULL DEFAULT 'https://github.com/muhgalihhh',
  dribbble_url text NOT NULL DEFAULT '#',
  linkedin_url text NOT NULL DEFAULT '#',
  instagram_url text NOT NULL DEFAULT '#'
);

-- Insert default profile row
INSERT INTO profile (id) VALUES (gen_random_uuid())
  ON CONFLICT DO NOTHING;

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile      ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "public read skills"       ON skills       FOR SELECT USING (true);
CREATE POLICY "public read experiences"  ON experiences  FOR SELECT USING (true);
CREATE POLICY "public read projects"     ON projects     FOR SELECT USING (published = true);
CREATE POLICY "public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "public read profile"      ON profile      FOR SELECT USING (true);

-- Authenticated (admin) can do all CRUD
CREATE POLICY "auth all skills"       ON skills       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth all experiences"  ON experiences  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth all projects"     ON projects     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth all certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth all profile"      ON profile      FOR ALL USING (auth.role() = 'authenticated');

-- ── Storage bucket ──────────────────────────────────────────
-- Run this separately in the Storage section or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
-- CREATE POLICY "public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
-- CREATE POLICY "auth upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
-- CREATE POLICY "auth delete portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
