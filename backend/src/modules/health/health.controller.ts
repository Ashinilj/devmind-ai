import type { Request, Response } from "express";
import { HealthService } from "./health.service.js";
import type { HealthRequest } from "./health.dto.js";

const healthService = new HealthService();

export const getHealthStatus = (_req: Request, res: Response) => {
  res.status(200).json(healthService.getStatus());
};

export const getHealth = (
  req: Request<{}, {}, HealthRequest>,
  res: Response,
) => {
  const result = healthService.getHealth(req.body.name);

  res.status(200).json(result);
};
