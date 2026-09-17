import type { Request, Response } from "express";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import { PostgresProjectRepository } from "./postgres-project.repository.js";
import { ProjectService } from "./project.service.js";

const projectService = new ProjectService(new PostgresProjectRepository());

export const createProject = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response,
) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json(project);
};

export const listProjects = async (
  _req: Request<{}, unknown, unknown, ListProjectsQuery>,
  res: Response,
) => {
  const result = await projectService.listProjects(
    res.locals.validatedQuery as ListProjectsQuery,
  );
  res.status(200).json(result);
};

export const getProject = async (req: Request<{ id: string }>, res: Response) => {
  const project = await projectService.getProject(req.params.id);
  res.status(200).json(project);
};

export const deleteProject = async (req: Request<{ id: string }>, res: Response) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).send();
};
