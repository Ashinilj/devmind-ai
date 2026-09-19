import bcrypt from "bcrypt";
import { AppError } from "../../utils/app-error.js";
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
}
