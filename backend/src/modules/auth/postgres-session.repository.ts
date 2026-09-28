import type { QueryResultRow } from "pg";
import { pool } from "../../db/database.js";
import type {
  CreateRefreshSession,
  IRefreshSessionRepository,
} from "./session.repository.js";
import type { RefreshSession } from "./session.types.js";

interface RefreshSessionRow extends QueryResultRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date | null;
}

function toRefreshSession(row: RefreshSessionRow): RefreshSession {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
  };
}

export class PostgresSessionRepository implements IRefreshSessionRepository {
  async create(input: CreateRefreshSession): Promise<RefreshSession> {
    const result = await pool.query<RefreshSessionRow>(
      `
        INSERT INTO refresh_sessions (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, token_hash, expires_at, created_at, revoked_at
      `,
      [input.userId, input.tokenHash, input.expiresAt],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Refresh session insert returned no row");
    }

    return toRefreshSession(row);
  }

  async findActiveByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const result = await pool.query<RefreshSessionRow>(
      `
        SELECT id, user_id, token_hash, expires_at, created_at, revoked_at
        FROM refresh_sessions
        WHERE token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
      `,
      [tokenHash],
    );

    return result.rows[0] ? toRefreshSession(result.rows[0]) : null;
  }

  async revoke(id: string): Promise<boolean> {
    const result = await pool.query(
      `
        UPDATE refresh_sessions
        SET revoked_at = NOW()
        WHERE id = $1 AND revoked_at IS NULL
      `,
      [id],
    );

    return result.rowCount === 1;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await pool.query(
      `
        UPDATE refresh_sessions
        SET revoked_at = NOW()
        WHERE user_id = $1 AND revoked_at IS NULL
      `,
      [userId],
    );
  }

  async deleteExpiredSessions(): Promise<number> {
    const result = await pool.query(
      "DELETE FROM refresh_sessions WHERE expires_at < NOW()",
    );

    return result.rowCount ?? 0;
  }
}
