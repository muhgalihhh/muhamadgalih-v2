-- ============================================================
-- Tambah kolom phone ke profile (untuk tombol WhatsApp di Contact)
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE profile ADD COLUMN IF NOT EXISTS phone TEXT;
