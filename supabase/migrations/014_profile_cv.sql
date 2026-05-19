-- ============================================================
-- Tambah kolom cv_url ke profile + izinkan PDF di bucket
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Kolom cv_url
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- 2. Append "application/pdf" ke allowed_mime_types kalau belum ada
UPDATE storage.buckets
SET allowed_mime_types = allowed_mime_types || ARRAY['application/pdf']
WHERE id = 'portfolio'
  AND NOT ('application/pdf' = ANY(allowed_mime_types));
