import { z } from "zod";

export const authRegisterSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export type AuthRegisterRequest = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export type AuthLoginRequest = z.infer<typeof authLoginSchema>;
