import { Router } from "express";
import { validateBody } from "../../middleware/validation.middleware.js";
import { authLoginSchema, authRegisterSchema } from "./auth.dto.js";
import { login, register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(authRegisterSchema), register);
authRoutes.post("/login", validateBody(authLoginSchema), login);
