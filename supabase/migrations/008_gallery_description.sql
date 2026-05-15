-- Tambah kolom description ke gallery_items
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
