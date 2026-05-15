CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can send a message
CREATE POLICY "Anyone can insert contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admin (authenticated) can read / update / delete
CREATE POLICY "Auth read contact messages"   ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update contact messages" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete contact messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');
