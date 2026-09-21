import type { RequestHandler } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(new AppError("Authentication required", 401));
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token || authorization.split(" ").length !== 2) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      next(new AppError("Authentication required", 401));
      return;
    }

    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError("Authentication required", 401));
  }
};
