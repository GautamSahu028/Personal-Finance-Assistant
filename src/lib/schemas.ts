import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required") // ensures password isn't empty
    .min(8, "Password must be at least 8 characters long"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),

  name: z.string().min(1, "Name cannot be empty").optional(),
});
