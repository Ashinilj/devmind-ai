import bcrypt from "bcrypt";
import { AppError } from "../../utils/app-error.js";
import {
  createAccessToken,
  getAccessTokenExpiresInSeconds,
} from "../../utils/jwt.js";
import type { User } from "../users/user.types.js";
import type { IUserRepository } from "../users/user.repository.js";

const passwordSaltRounds = 12;

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

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

    return {
      accessToken: createAccessToken(user.id),
      tokenType: "Bearer" as const,
      expiresIn: getAccessTokenExpiresInSeconds(),
    };
  }
}
