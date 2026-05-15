-- ============================================================
-- PORTFOLIO SCHEMA MIGRATION
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Skills ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'development', -- 'development' | 'design'
  color_class TEXT NOT NULL DEFAULT 'bg-violet text-cream',
  icon        TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Experiences ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role                TEXT NOT NULL,
  company             TEXT NOT NULL,
  company_logo_emoji  TEXT NOT NULL DEFAULT '🏢',
  company_logo_url    TEXT,
  period              TEXT NOT NULL,
  color_class         TEXT NOT NULL DEFAULT 'bg-violet',
  text_color_class    TEXT NOT NULL DEFAULT 'text-cream',
  points              TEXT[] NOT NULL DEFAULT '{}',
  order_index         INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'software', -- 'software' | 'uiux' | 'illustration'
  description      TEXT NOT NULL DEFAULT '',
  tech_stack       TEXT[] NOT NULL DEFAULT '{}',
  emoji            TEXT NOT NULL DEFAULT '⚡',
  color_class      TEXT NOT NULL DEFAULT 'bg-violet',
  text_color_class TEXT NOT NULL DEFAULT 'text-cream',
  image_urls       TEXT[] NOT NULL DEFAULT '{}',
  link             TEXT NOT NULL DEFAULT '#',
  order_index      INTEGER NOT NULL DEFAULT 0,
  published        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Certificates ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     DATE,
  credential_url TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Profile ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL DEFAULT 'Muhamad Galih',
  alias         TEXT NOT NULL DEFAULT 'MIZARIE',
  email         TEXT NOT NULL DEFAULT '',
  location      TEXT NOT NULL DEFAULT 'Indonesia',
  availability  BOOLEAN NOT NULL DEFAULT TRUE,
  bio           TEXT NOT NULL DEFAULT '',
  github_url    TEXT NOT NULL DEFAULT '',
  dribbble_url  TEXT NOT NULL DEFAULT '',
  linkedin_url  TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seed default profile row ─────────────────────────────────
INSERT INTO profile (name, alias, email, location, availability, bio, github_url)
VALUES (
  'Muhamad Galih',
  'MIZARIE',
  'galihslank79@gmail.com',
  'Indonesia',
  TRUE,
  'Full-Stack Engineer, UI/UX Designer, and Illustrator based in Indonesia.',
  'https://github.com/muhgalihhh'
)
ON CONFLICT DO NOTHING;

-- ── RLS (Row Level Security) ──────────────────────────────────
ALTER TABLE skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile      ENABLE ROW LEVEL SECURITY;

-- Public: siapa saja bisa baca (SELECT)
CREATE POLICY "public_read_skills"       ON skills       FOR SELECT USING (TRUE);
CREATE POLICY "public_read_experiences"  ON experiences  FOR SELECT USING (TRUE);
CREATE POLICY "public_read_projects"     ON projects     FOR SELECT USING (published = TRUE);
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT USING (TRUE);
CREATE POLICY "public_read_profile"      ON profile      FOR SELECT USING (TRUE);

-- Admin: user yang sudah login bisa INSERT, UPDATE, DELETE
CREATE POLICY "auth_all_skills"       ON skills       FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_experiences"  ON experiences  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_projects"     ON projects     FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_certificates" ON certificates FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_profile"      ON profile      FOR ALL USING (auth.uid() IS NOT NULL);
