import { Pool } from "pg";
import { env } from "../config/env.js";

export const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};