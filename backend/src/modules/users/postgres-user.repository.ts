import type { QueryResultRow } from "pg";
import { pool } from "../../db/database.js";
import type {
  CreateUser,
  IUserRepository,
  UserWithPassword,
} from "./user.repository.js";
import type { User } from "./user.types.js";

interface UserRow extends QueryResultRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toUserWithPassword(row: UserRow): UserWithPassword {
  return {
    ...toUser(row),
    passwordHash: row.password_hash,
  };
}

export class PostgresUserRepository implements IUserRepository {
  async create(input: CreateUser): Promise<User> {
    const result = await pool.query<UserRow>(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, created_at, updated_at
      `,
      [input.email, input.passwordHash],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("User insert returned no row");
    }

    return toUser(row);
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await pool.query<UserRow>(
      `
        SELECT id, email, password_hash, created_at, updated_at
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    return result.rows[0] ? toUserWithPassword(result.rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<UserRow>(
      `
        SELECT id, email, created_at, updated_at
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? toUser(result.rows[0]) : null;
  }
}
