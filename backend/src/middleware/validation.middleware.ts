import type { RequestHandler } from "express";
import { z } from "zod";

export const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next({
        statusCode: 400,
        message: "Invalid request body",
      });

      return;
    }

    req.body = result.data;
    next();
  };
};