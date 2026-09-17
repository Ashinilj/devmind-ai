import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./database.js";

const migrations = [
  {
    name: "001_create_projects",
    file: new URL("../../migrations/001_create_projects.sql", import.meta.url),
  },
  {
    name: "002_project_database_defaults",
    file: new URL("../../migrations/002_project_database_defaults.sql", import.meta.url),
  },
  {
    name: "002_add_project_indexes",
    file: new URL("../../migrations/002_add_project_indexes.sql", import.meta.url),
  },
  {
    name: "003_add_users_and_project_ownership",
    file: new URL(
      "../../migrations/003_add_users_and_project_ownership.sql",
      import.meta.url,
    ),
  },
];

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const migration of migrations) {
      const result = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name = $1",
        [migration.name],
      );

      if (result.rowCount !== 0) {
        continue;
      }

      await client.query("BEGIN");
      try {
        await client.query(await readFile(fileURLToPath(migration.file), "utf8"));
        await client.query(
          "INSERT INTO schema_migrations (name) VALUES ($1)",
          [migration.name],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    client.release();
  }
}
