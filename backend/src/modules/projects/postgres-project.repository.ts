import type { QueryResultRow } from "pg";
import { pool } from "../../db/database.js";
import type {
  FindAllOptions,
  FindAllResult,
  IProjectRepository,
} from "./project.repository.js";
import type { Project } from "./project.types.js";

interface ProjectRow extends QueryResultRow {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  created_at: Date;
  updated_at: Date;
}

const sortColumns = {
  name: "name",
  createdAt: "created_at",
} as const;

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    repositoryUrl: row.repository_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PostgresProjectRepository implements IProjectRepository {
  async create(project: Pick<Project, "name" | "description" | "repositoryUrl">): Promise<Project> {
    const result = await pool.query<ProjectRow>(
      `
        INSERT INTO projects (
          name, description, repository_url
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, description, repository_url, created_at, updated_at
      `,
      [
        project.name,
        project.description,
        project.repositoryUrl,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Project insert returned no row");
    }

    return toProject(row);
  }

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (options.search) {
      values.push(`%${options.search}%`);
      conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
    const sortColumn = sortColumns[options.sortBy];
    const sortDirection = options.sortOrder === "desc" ? "DESC" : "ASC";
    const offset = (options.page - 1) * options.limit;

    const totalResult = await pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM projects ${whereClause}`,
      values,
    );

    const dataValues = [...values, options.limit, offset];
    const projectsResult = await pool.query<ProjectRow>(
      `
        SELECT id, name, description, repository_url, created_at, updated_at
        FROM projects
        ${whereClause}
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}
      `,
      dataValues,
    );

    return {
      projects: projectsResult.rows.map(toProject),
      total: Number(totalResult.rows[0]?.total ?? 0),
    };
  }

  async findById(id: string): Promise<Project | null> {
    const result = await pool.query<ProjectRow>(
      `
        SELECT id, name, description, repository_url, created_at, updated_at
        FROM projects
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? toProject(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return result.rowCount === 1;
  }
}
