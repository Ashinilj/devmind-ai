import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  repositoryUrl: z.url(),
});

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
