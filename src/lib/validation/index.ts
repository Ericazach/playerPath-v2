import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 chars.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 chars.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 chars.",
  }),
});

export const SigninValidation = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 chars.",
  }),
});
