import { Router } from "express";
import { validateBody } from "../../middleware/validation.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { authLoginSchema, authRegisterSchema } from "./auth.dto.js";
import { login, me, register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(authRegisterSchema), register);
authRoutes.post("/login", validateBody(authLoginSchema), login);
authRoutes.get("/me", requireAuth, me);
