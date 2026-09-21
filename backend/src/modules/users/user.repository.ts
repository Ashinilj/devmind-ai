import type { User } from "./user.types.js";

export interface CreateUser {
  email: string;
  passwordHash: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface IUserRepository {
  create(user: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  findById(id: string): Promise<User | null>;
}
