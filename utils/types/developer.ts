import * as z from "zod";
import { passwordSchema } from "./auth";

// DEVELOPER TYPES
// developer/profile
export type DeveloperType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  name?: string;
  email: string;
  password?: string;
};

// zod infered Type
export type DeveloperFormType = z.infer<typeof developerFormSchema>;

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

// DEVELOPER SCHEMA
export const developerFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Field must be at least 2 characters.",
    }),
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
