import { AppError } from "../../utils/app-error.js";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import type { IProjectRepository } from "./project.repository.js";
import type { Project } from "./project.types.js";

export class ProjectService {
  constructor(private readonly repository: IProjectRepository) {}

  async createProject(input: CreateProjectRequest): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(project);
  }

  async listProjects(options: ListProjectsQuery) {
    const { projects, total } = await this.repository.findAll(options);

    return {
      data: projects,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.repository.findById(id);

    if (project === null) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  async deleteProject(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) {
      throw new AppError("Project not found", 404);
    }
  }
}
