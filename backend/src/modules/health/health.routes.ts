import { Router } from 'express';
import { getHealth, getHealthStatus } from './health.controller.js';
import { healthRequestSchema } from "./health.dto.js";
import { validateBody } from "../../middleware/validation.middleware.js";

export const healthRoutes = Router();

healthRoutes.get('/', getHealthStatus);
healthRoutes.post("/", validateBody(healthRequestSchema), getHealth);
