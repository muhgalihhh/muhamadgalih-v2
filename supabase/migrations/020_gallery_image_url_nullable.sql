-- The app no longer writes to the legacy image_url column (superseded by
-- image_urls array); relax its NOT NULL constraint so new inserts don't fail.
ALTER TABLE gallery_items ALTER COLUMN image_url DROP NOT NULL;
