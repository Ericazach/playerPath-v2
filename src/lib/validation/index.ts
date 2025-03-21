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

export const PostValidation = z.object({
  title: z.string().min(5).max(100, {
    message: "Title must be between 5 and 100 chars.",
  }),
  description: z.string().min(5).max(500, {
    message: "Description must be between 5 and 500 chars.",
  }),
  file: z.custom<File[]>(),
});

export const EditPostValidation = z.object({
  title: z.string().min(5).max(100, {
    message: "Title must be between 5 and 100 chars.",
  }),
  description: z.string().min(5).max(500, {
    message: "Description must be between 5 and 500 chars.",
  }),
  file: z.custom<File[]>(),
  State: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
