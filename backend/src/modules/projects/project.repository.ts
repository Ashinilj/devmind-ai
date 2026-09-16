import type { Project } from "./project.types.js";

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

export class ProjectRepository {
  private readonly projects = new Map<string, Project>();

  create(project: Project): Project {
    this.projects.set(project.id, project);
    return project;
  }

  findAll(options: FindAllOptions): FindAllResult {
    const search = options.search?.toLowerCase();
    const filteredProjects = [...this.projects.values()].filter((project) => {
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

  findById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  delete(id: string): boolean {
    return this.projects.delete(id);
  }
}
