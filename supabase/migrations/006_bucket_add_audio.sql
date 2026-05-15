-- ============================================================
-- Tambahkan tipe audio ke bucket portfolio yang sudah ada
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/aac'
]
WHERE id = 'portfolio';
