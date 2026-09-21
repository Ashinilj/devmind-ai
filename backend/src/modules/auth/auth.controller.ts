import type { Request, Response } from "express";
import type { AuthLoginRequest, AuthRegisterRequest } from "./auth.dto.js";
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

export const login = async (
  req: Request<{}, {}, AuthLoginRequest>,
  res: Response,
) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.status(200).json(result);
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ status: "error", message: "Authentication required" });
    return;
  }

  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json(user);
};
