-- ============================================================
-- Project detail page: URL slug + rich content (Tiptap JSON)
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content jsonb;

-- Backfill slugs from titles (same rules as slugify() in src/lib/projectContent.ts,
-- minus accent folding): lowercase, non [a-z0-9] runs -> '-', max 60 chars cut at a
-- word boundary, duplicates get -2, -3, ... in created_at order.
WITH base AS (
  SELECT id, created_at,
    coalesce(nullif(trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), ''), 'project') AS b
  FROM projects
  WHERE slug IS NULL
), capped AS (
  SELECT id, created_at,
    CASE
      WHEN length(b) <= 60 THEN b
      WHEN position('-' in left(b, 61)) > 0 THEN regexp_replace(left(b, 61), '-[^-]*$', '')
      ELSE left(b, 60)
    END AS b
  FROM base
), numbered AS (
  SELECT id, b, row_number() OVER (PARTITION BY b ORDER BY created_at, id) AS n
  FROM capped
)
UPDATE projects p
SET slug = CASE WHEN numbered.n = 1 THEN numbered.b ELSE numbered.b || '-' || numbered.n END
FROM numbered
WHERE p.id = numbered.id;

ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;
ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
