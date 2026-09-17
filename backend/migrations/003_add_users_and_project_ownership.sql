CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS owner_id UUID;

ALTER TABLE projects
ADD CONSTRAINT fk_projects_owner
FOREIGN KEY (owner_id)
REFERENCES users(id)
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_projects_owner_id
ON projects (owner_id);
