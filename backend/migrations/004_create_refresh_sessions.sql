CREATE TABLE IF NOT EXISTS refresh_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_refresh_sessions_user_id
ON refresh_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_sessions_expires_at
ON refresh_sessions (expires_at);
