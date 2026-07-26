CREATE TABLE IF NOT EXISTS education (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution             text NOT NULL,
  degree                  text NOT NULL,
  institution_logo_url    text,
  institution_logo_emoji  text NOT NULL DEFAULT '🎓',
  period                  text NOT NULL,
  start_date              date,
  end_date                date,
  gpa                     text,
  color_class             text NOT NULL DEFAULT 'bg-sky',
  text_color_class        text NOT NULL DEFAULT 'text-ink',
  points                  text[] NOT NULL DEFAULT '{}',
  order_index             int  NOT NULL DEFAULT 0,
  created_at              timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_education_dates ON education (end_date DESC NULLS FIRST, start_date DESC);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_education" ON education FOR SELECT USING (TRUE);
CREATE POLICY "auth_all_education"    ON education FOR ALL    USING (auth.uid() IS NOT NULL);
