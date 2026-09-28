import type {
  FindAllOptions,
  FindAllResult,
  IProjectRepository,
} from "./project.repository.js";
import type { CreateProject, Project } from "./project.types.js";

export class InMemoryProjectRepository implements IProjectRepository {
  private readonly projects: Project[] = [];

  async create(ownerId: string, input: CreateProject): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: crypto.randomUUID(),
      ownerId,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.push(project);
    return project;
  }

  async findAll(ownerId: string, options: FindAllOptions): Promise<FindAllResult> {
    const search = options.search?.toLowerCase();
    const filteredProjects = this.projects.filter((project) => {
      if (project.ownerId !== ownerId) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
      );
    });

    filteredProjects.sort((first, second) => {
      const firstValue = options.sortBy === "name"
        ? first.name.toLowerCase()
        : first.createdAt.getTime();
      const secondValue = options.sortBy === "name"
        ? second.name.toLowerCase()
        : second.createdAt.getTime();
      const comparison = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;

      return options.sortOrder === "asc" ? comparison : -comparison;
    });

    const offset = (options.page - 1) * options.limit;

    return {
      projects: filteredProjects.slice(offset, offset + options.limit),
      total: filteredProjects.length,
    };
  }

  async findById(id: string, ownerId: string): Promise<Project | null> {
    return this.projects.find((project) => project.id === id && project.ownerId === ownerId) ?? null;
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const index = this.projects.findIndex((project) => project.id === id && project.ownerId === ownerId);

    if (index === -1) {
      return false;
    }

    this.projects.splice(index, 1);
    return true;
  }
}