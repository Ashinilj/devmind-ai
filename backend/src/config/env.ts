import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.issues);
  process.exit(1);
}

export const env = {
  port: parsedEnv.data.PORT,

  database: {
    host: parsedEnv.data.DB_HOST,
    port: parsedEnv.data.DB_PORT,
    name: parsedEnv.data.DB_NAME,
    user: parsedEnv.data.DB_USER,
    password: parsedEnv.data.DB_PASSWORD,
  },
};