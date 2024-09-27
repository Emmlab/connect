import * as z from "zod";

// AUTH TYPES
export type SignupFormType = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormType = {
  email: string;
  password: string;
};

// AUTH ZOD SCHEMA
// Zod password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()]/,
    "Password must contain at least one special character",
  );

export const signupFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Field must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: passwordSchema,
});
