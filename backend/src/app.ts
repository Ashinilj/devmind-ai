import express from 'express';
import { healthRoutes } from './modules/health/health.routes.js';
import { projectRoutes } from './modules/projects/project.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

app.use(express.json());
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);

export default app;
