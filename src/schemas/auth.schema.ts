import { z } from 'zod';

const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const userSchema = z.object({
    username: z.string().min(10).max(255),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
    isActive: z.boolean(),
    email: z.string().regex(emailRegex),
    personId: z.number()
});

export const userSchemaForUpdate = z.object({
    username: z.string().min(10).max(255),
    isActive: z.boolean(),
    email: z.string().regex(emailRegex),
    personId: z.number()
});
