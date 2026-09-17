CREATE INDEX IF NOT EXISTS idx_projects_name
ON projects (name);

CREATE INDEX IF NOT EXISTS idx_projects_created_at
ON projects (created_at);
