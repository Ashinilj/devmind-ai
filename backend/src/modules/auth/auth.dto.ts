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

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
