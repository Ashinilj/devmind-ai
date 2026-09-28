CREATE INDEX IF NOT EXISTS idx_refresh_sessions_expires_at
ON refresh_sessions (expires_at);