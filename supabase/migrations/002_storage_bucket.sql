-- ============================================================
-- STORAGE BUCKET SETUP
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Buat bucket "portfolio" (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  TRUE,
  10485760,  -- 10 MB max per file
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/aac'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Policy: siapa saja bisa baca file (public bucket)
CREATE POLICY "public_read_portfolio_storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Policy: hanya user yang login yang bisa upload
CREATE POLICY "auth_insert_portfolio_storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.uid() IS NOT NULL);

-- Policy: hanya user yang login yang bisa hapus file miliknya
CREATE POLICY "auth_delete_portfolio_storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.uid() IS NOT NULL);
