CREATE TABLE IF NOT EXISTS project_categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  label       TEXT        NOT NULL,
  order_index INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed existing categories
INSERT INTO project_categories (slug, label, order_index) VALUES
  ('software',     'Software',     0),
  ('uiux',         'UI/UX',        1),
  ('illustration', 'Illustration', 2)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories"  ON project_categories FOR SELECT USING (true);
CREATE POLICY "Auth write categories"   ON project_categories FOR ALL    USING (auth.role() = 'authenticated');
