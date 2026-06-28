-- ============================================================
-- Add structured date columns so Experience / Works /
-- Organizations / Certificates lists can sort chronologically
-- (newest at top). The free-text `period` is kept for display.
-- ============================================================

-- Work Experience: start/end dates (end_date NULL = ongoing / "Present")
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date   date;

-- Organizations: same shape as experiences
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date   date;

-- Projects / Works: single date (when the project was done / shipped)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS project_date date;

-- certificates.issue_date already exists — now used for ordering.

-- Indexes matching the sort order used by the queries
CREATE INDEX IF NOT EXISTS idx_experiences_dates   ON experiences   (end_date DESC NULLS FIRST, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_organizations_dates ON organizations (end_date DESC NULLS FIRST, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_date       ON projects      (project_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_certificates_date   ON certificates  (issue_date DESC NULLS LAST);
