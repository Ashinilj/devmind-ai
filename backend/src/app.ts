import express from 'express';
import { healthRoutes } from './modules/health/health.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

app.use(express.json());
app.use('/api/v1/health', healthRoutes);
app.use(errorHandler);
