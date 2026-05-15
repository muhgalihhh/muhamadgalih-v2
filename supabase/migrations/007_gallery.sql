-- ============================================================
-- GALLERY ITEMS TABLE
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'illustration', -- 'illustration' | 'uiux' | 'branding' | 'motion'
  image_url   TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Public: hanya item yang published bisa dibaca
CREATE POLICY "public_read_gallery" ON gallery_items FOR SELECT USING (published = TRUE);

-- Admin: user yang login bisa semua operasi
CREATE POLICY "auth_all_gallery" ON gallery_items FOR ALL USING (auth.uid() IS NOT NULL);
