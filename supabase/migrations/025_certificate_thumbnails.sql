-- ============================================================
-- Pre-rendered certificate thumbnails (small WebP of the PDF's first page),
-- so the public site shows an <img> instead of rendering PDFs in the browser.
-- ============================================================

ALTER TABLE certificates ADD COLUMN IF NOT EXISTS thumbnail_url text;
