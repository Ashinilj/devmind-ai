import { z } from "zod";

export const healthRequestSchema = z.object({
  name: z.string().min(1),
});

export type HealthRequest = z.infer<typeof healthRequestSchema>;