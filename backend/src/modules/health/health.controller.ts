import type { Request, Response } from 'express';
import { getHealthStatus } from './health.service.js';

export function getHealth(_request: Request, response: Response): void {
  response.json(getHealthStatus());
}
