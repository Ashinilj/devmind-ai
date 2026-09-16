import { Router } from "express";
import { validateBody, validateQuery } from "../../middleware/validation.middleware.js";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
} from "./project.controller.js";
import {
  createProjectSchema,
  listProjectsQuerySchema,
  type ListProjectsQuery,
} from "./project.dto.js";

export const projectRoutes = Router();

projectRoutes.post("/", validateBody(createProjectSchema), createProject);
projectRoutes.get<{}, unknown, unknown, ListProjectsQuery>(
  "/",
  validateQuery(listProjectsQuerySchema),
  listProjects,
);
projectRoutes.get("/:id", getProject);
projectRoutes.delete("/:id", deleteProject);
