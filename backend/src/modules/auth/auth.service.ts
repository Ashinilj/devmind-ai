import bcrypt from "bcrypt";
import { AppError } from "../../utils/app-error.js";
import {
  createAccessToken,
  getAccessTokenExpiresInSeconds,
} from "../../utils/jwt.js";
import type { User } from "../users/user.types.js";
import type { IUserRepository } from "../users/user.repository.js";
import type { IRefreshSessionRepository } from "./session.repository.js";
import { generateRefreshToken, hashRefreshToken } from "./refresh-token.js";

const refreshTokenLifetimeMs = 30 * 24 * 60 * 60 * 1000;

const passwordSaltRounds = 12;

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshSessionRepository,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, passwordSaltRounds);

    return this.userRepository.create({
      email: normalizedEmail,
      passwordHash,
    });
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError("Invalid email or password", 401);
    }

    return this.createTokenPair(user.id);
  }

  async refresh(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const session = await this.sessionRepository.findActiveByTokenHash(tokenHash);

    if (!session) {
      throw new AppError("Authentication required", 401);
    }

    return this.createTokenPair(session.userId, session.id);
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionRepository.findActiveByTokenHash(
      hashRefreshToken(refreshToken),
    );

    if (!session) {
      throw new AppError("Authentication required", 401);
    }

    await this.sessionRepository.revoke(session.id);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.revokeAllForUser(userId);
  }

  private async createTokenPair(userId: string, revokedSessionId?: string) {
    const refreshToken = generateRefreshToken();

    const sessionInput = {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshTokenLifetimeMs),
    };

    if (revokedSessionId) {
      await this.sessionRepository.rotate(revokedSessionId, sessionInput);
    } else {
      await this.sessionRepository.create(sessionInput);
    }

    return {
      accessToken: createAccessToken(userId),
      tokenType: "Bearer" as const,
      expiresIn: getAccessTokenExpiresInSeconds(),
      refreshToken,
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
