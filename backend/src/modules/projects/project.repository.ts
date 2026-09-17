import type { CreateProject, Project } from "./project.types.js";

export interface FindAllOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  sortBy: "name" | "createdAt";
  sortOrder: "asc" | "desc";
}

export interface FindAllResult {
  projects: Project[];
  total: number;
}

export interface IProjectRepository {
  create(project: CreateProject): Promise<Project>;
  findAll(options: FindAllOptions): Promise<FindAllResult>;
  findById(id: string): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}
