import * as z from "zod";
import { PASSWORD_REGEX } from "../magicValues";

// AUTH/DEVELOPER/PROFILE
export type SignupFormType = {
  name: string;
  email: string;
  password: string;
};
export const signupFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Field must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    password: z
      .string()
      .min(1, { message: "Must have at least 1 character" })
      .regex(PASSWORD_REGEX, {
        message: "Your password is not valid",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Must have at least 1 character" })
      .regex(PASSWORD_REGEX, {
        message: "Your password is not valid",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export type LoginFormType = {
  email: string;
  password: string;
};
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .regex(PASSWORD_REGEX, {
      message: "Your password is not valid",
    }),
});

// developer/profile
export type DeveloperType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  name?: string;
  email: string;
  password?: string;
};
export const developerFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Field must be at least 2 characters.",
    }),
    password: z
      .string()
      .regex(PASSWORD_REGEX, {
        message: "Your password is not valid",
      })
      .optional(),
    confirmPassword: z
      .string()
      .regex(PASSWORD_REGEX, {
        message: "Your password is not valid",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
export type DeveloperFormType = z.infer<typeof developerFormSchema>;

// github types
export type GithubDeveloperType = {
  total_count: number;
  items: [
    {
      login: string;
      avatar_url: string;
      url: string;
      type: string;
    },
  ];
};

export type GithubDeveloperRepositoriesType = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  created_at: string;
  language: string;
};
