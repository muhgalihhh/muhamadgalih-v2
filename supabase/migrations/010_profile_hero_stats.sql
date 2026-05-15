-- Tambah kolom dynamic untuk hero roles & about stats
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_roles TEXT[] NOT NULL DEFAULT ARRAY[
  'Full-Stack Engineering',
  'UI/UX Design',
  'Illustration & Art'
];
ALTER TABLE profile ADD COLUMN IF NOT EXISTS years_experience INTEGER NOT NULL DEFAULT 3;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS clients_count INTEGER NOT NULL DEFAULT 2;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS coffee_label TEXT NOT NULL DEFAULT '∞';
