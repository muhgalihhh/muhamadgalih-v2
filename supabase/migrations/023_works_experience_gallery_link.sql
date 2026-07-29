-- ============================================================
-- Link Works <-> Experience, dan Works -> Gallery (per kategori)
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Satu Work (project) boleh di-link ke satu Experience.
--    Banyak works boleh nunjuk ke experience yang sama.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL;

-- 2. Tandai kategori project mana yang otomatis tampil di Design Gallery.
ALTER TABLE project_categories ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN NOT NULL DEFAULT false;

-- 3. Default: kategori visual yang sudah ada diaktifkan.
UPDATE project_categories SET show_in_gallery = true WHERE slug IN ('uiux', 'illustration');
