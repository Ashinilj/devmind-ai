import type { RefreshSession } from "./session.types.js";

export interface CreateRefreshSession {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IRefreshSessionRepository {
  create(session: CreateRefreshSession): Promise<RefreshSession>;
  findActiveByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
  revoke(id: string): Promise<boolean>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpiredSessions(): Promise<number>;
}
