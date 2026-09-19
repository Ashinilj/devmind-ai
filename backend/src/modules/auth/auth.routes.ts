import { Router } from "express";
import { validateBody } from "../../middleware/validation.middleware.js";
import { authRegisterSchema } from "./auth.dto.js";
import { register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(authRegisterSchema), register);
