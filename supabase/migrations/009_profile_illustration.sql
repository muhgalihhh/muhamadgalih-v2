-- Tambah kolom illustration_url ke profile
ALTER TABLE profile ADD COLUMN IF NOT EXISTS illustration_url TEXT;
