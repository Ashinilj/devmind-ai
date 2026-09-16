import { AppError } from "../../utils/app-error.js";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import { ProjectRepository } from "./project.repository.js";
import type { Project } from "./project.types.js";

export class ProjectService {
  constructor(private readonly repository = new ProjectRepository()) {}

  createProject(input: CreateProjectRequest): Project {
    const now = new Date();
    const project: Project = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(project);
  }

  listProjects(options: ListProjectsQuery) {
    const { projects, total } = this.repository.findAll(options);

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

  getProject(id: string): Project {
    const project = this.repository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  deleteProject(id: string): void {
    if (!this.repository.delete(id)) {
      throw new AppError("Project not found", 404);
    }
  }
}
