import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function getAccessTokenExpiresInSeconds(): number {
  const match = /^(\d+)([smhd])$/.exec(env.jwt.accessTokenExpiresIn);

  if (!match) {
    throw new Error("JWT_ACCESS_TOKEN_EXPIRES_IN must use a duration such as 15m");
  }

  const amount = Number(match[1]);
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 } as const;

  return amount * multipliers[match[2] as keyof typeof multipliers];
}

export function createAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    env.jwt.secret,
    { expiresIn: getAccessTokenExpiresInSeconds() },
  );
}