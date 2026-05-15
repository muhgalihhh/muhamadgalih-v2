-- ============================================================
-- Tambah kolom music_url dan spotify_embed_url ke profile
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS music_url TEXT,
  ADD COLUMN IF NOT EXISTS spotify_embed_url TEXT;
