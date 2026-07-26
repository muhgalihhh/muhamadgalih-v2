ALTER TABLE projects ADD COLUMN IF NOT EXISTS links jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE projects
SET links = jsonb_build_array(jsonb_build_object('label', 'Live Demo', 'url', link))
WHERE link IS NOT NULL AND link <> '' AND link <> '#' AND jsonb_array_length(links) = 0;

UPDATE storage.buckets
SET allowed_mime_types = array_append(allowed_mime_types, 'application/pdf')
WHERE id = 'portfolio' AND NOT ('application/pdf' = ANY(allowed_mime_types));
