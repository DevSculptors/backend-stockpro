import { z } from "zod";

export const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const userSchema = z.object({
  username: z.string().min(5).max(255),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  isActive: z.boolean(),
  email: z.string().regex(emailRegex),
  personId: z.string(),
});

export const userSchemaForUpdate = z.object({
  username: z.string().min(5).max(255),
  isActive: z.boolean(),
  email: z.string().regex(emailRegex),
  personId: z.string(),
});

