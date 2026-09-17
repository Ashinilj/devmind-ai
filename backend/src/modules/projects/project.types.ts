export interface Project {
  id: string;
  name: string;
  description: string;
  repositoryUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProject = Pick<
  Project,
  "name" | "description" | "repositoryUrl"
>;