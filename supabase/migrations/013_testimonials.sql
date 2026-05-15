CREATE TABLE IF NOT EXISTS testimonials (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name    TEXT        NOT NULL,
  author_email   TEXT,
  author_avatar  TEXT,
  author_role    TEXT,
  author_company TEXT,
  content        TEXT        NOT NULL,
  rating         INTEGER     NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public: read approved testimonials, or own (pending) ones
CREATE POLICY "Public read approved testimonials" ON testimonials
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

-- Authenticated Google users can insert their own
CREATE POLICY "Users insert testimonial" ON testimonials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own before approval
CREATE POLICY "Users update own testimonial" ON testimonials
  FOR UPDATE USING (auth.uid() = user_id AND approved = false);
