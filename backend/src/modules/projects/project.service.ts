import { AppError } from "../../utils/app-error.js";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import type { IProjectRepository } from "./project.repository.js";
import type { Project } from "./project.types.js";

export class ProjectService {
  constructor(private readonly repository: IProjectRepository) {}

  async createProject(ownerId: string, input: CreateProjectRequest): Promise<Project> {
    return this.repository.create(ownerId, input);
  }

  async listProjects(ownerId: string, options: ListProjectsQuery) {
    const { projects, total } = await this.repository.findAll(ownerId, options);

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

  async getProject(ownerId: string, id: string): Promise<Project> {
    const project = await this.repository.findById(id, ownerId);

    if (project === null) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  async deleteProject(ownerId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(id, ownerId))) {
      throw new AppError("Project not found", 404);
    }
  }
}
