import { z } from "zod";
import { FormErrors } from "../types";

export const emailSchema = z
  .string()
  .min(1, { message: "Email is required." })
  .email({ message: "Please enter a valid email address." });

export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required." })
  .min(6, { message: "Password must be at least 6 characters long." });

export const nameSchema = z
  .string()
  .min(1, { message: "Full name is required." })
  .min(2, { message: "Full name must be at least 2 characters long." });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

/**
 * Helper function to parse Zod errors into a flat record of field names to error messages.
 */
export function formatZodError(error: z.ZodError<any>): FormErrors {
  const errors: FormErrors = {};
  error.issues.forEach((err: z.ZodIssue) => {
    if (err.path[0]) {
      errors[err.path[0].toString()] = err.message;
    }
  });
  return errors;
}
