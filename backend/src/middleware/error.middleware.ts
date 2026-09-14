import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });

    return;
  }

  const statusCode =
    typeof err?.statusCode === "number" ? err.statusCode : 500;

  res.status(statusCode).json({
    status: "error",
    message: "Internal server error",
  });
};