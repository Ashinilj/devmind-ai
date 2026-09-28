import type { Request, Response } from "express";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import { PostgresProjectRepository } from "./postgres-project.repository.js";
import { ProjectService } from "./project.service.js";

const projectService = new ProjectService(new PostgresProjectRepository());

function getAuthenticatedUserId(req: { user?: { id: string } }): string {
  if (!req.user) {
    throw new Error("Authentication middleware did not attach a user");
  }

  return req.user.id;
}

export const createProject = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response,
) => {
  const project = await projectService.createProject(
    getAuthenticatedUserId(req),
    req.body,
  );
  res.status(201).json(project);
};

export const listProjects = async (
  req: Request<{}, unknown, unknown, ListProjectsQuery>,
  res: Response,
) => {
  const result = await projectService.listProjects(
    getAuthenticatedUserId(req),
    res.locals.validatedQuery as ListProjectsQuery,
  );
  res.status(200).json(result);
};

export const getProject = async (req: Request<{ id: string }>, res: Response) => {
  const project = await projectService.getProject(
    getAuthenticatedUserId(req),
    req.params.id,
  );
  res.status(200).json(project);
};

export const deleteProject = async (req: Request<{ id: string }>, res: Response) => {
  await projectService.deleteProject(
    getAuthenticatedUserId(req),
    req.params.id,
  );
  res.status(204).send();
};
