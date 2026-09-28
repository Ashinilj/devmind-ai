import type { Request, Response } from "express";
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  RefreshTokenRequest,
} from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { PostgresUserRepository } from "../users/postgres-user.repository.js";
import { PostgresRefreshSessionRepository } from "./postgres-refresh-session.repository.js";
import { AppError } from "../../utils/app-error.js";

const authService = new AuthService(
  new PostgresUserRepository(),
  new PostgresRefreshSessionRepository(),
);

function getRefreshToken(req: Request): string {
  const refreshToken = req.body?.refreshToken;

  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    throw new AppError("Authentication required", 401);
  }

  return refreshToken;
}

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

export const refresh = async (
  req: Request<{}, {}, RefreshTokenRequest>,
  res: Response,
) => {
  const result = await authService.refresh(getRefreshToken(req));
  res.status(200).json(result);
};

export const logout = async (
  req: Request<{}, {}, RefreshTokenRequest>,
  res: Response,
) => {
  await authService.logout(getRefreshToken(req));
  res.status(204).send();
};

export const logoutAll = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ status: "error", message: "Authentication required" });
    return;
  }

  await authService.logoutAll(req.user.id);
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ status: "error", message: "Authentication required" });
    return;
  }

  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json(user);
};
