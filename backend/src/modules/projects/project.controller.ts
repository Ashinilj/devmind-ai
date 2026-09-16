import type { Request, Response } from "express";
import type { CreateProjectRequest, ListProjectsQuery } from "./project.dto.js";
import { ProjectService } from "./project.service.js";

const projectService = new ProjectService();

export const createProject = (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response,
) => {
  res.status(201).json(projectService.createProject(req.body));
};

export const listProjects = (
  _req: Request<{}, unknown, unknown, ListProjectsQuery>,
  res: Response,
) => {
  res.status(200).json(
    projectService.listProjects(res.locals.validatedQuery as ListProjectsQuery),
  );
};

export const getProject = (req: Request<{ id: string }>, res: Response) => {
  res.status(200).json(projectService.getProject(req.params.id));
};

export const deleteProject = (req: Request<{ id: string }>, res: Response) => {
  projectService.deleteProject(req.params.id);
  res.status(204).send();
};
