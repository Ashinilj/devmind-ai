import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../utils/app-error.js";

export const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          "Validation failed",
          400,
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );

      return;
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = <T>(schema: z.ZodType<T>): RequestHandler<any, any, any, T> => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(
        new AppError(
          "Validation failed",
          400,
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );

      return;
    }

    res.locals.validatedQuery = result.data;
    next();
  };
};