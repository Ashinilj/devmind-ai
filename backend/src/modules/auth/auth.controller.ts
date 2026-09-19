import type { Request, Response } from "express";
import type { AuthRegisterRequest } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { PostgresUserRepository } from "../users/postgres-user.repository.js";

const authService = new AuthService(new PostgresUserRepository());

export const register = async (
  req: Request<{}, {}, AuthRegisterRequest>,
  res: Response,
) => {
  const user = await authService.register(req.body.email, req.body.password);
  res.status(201).json(user);
};
