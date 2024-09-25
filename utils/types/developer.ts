import * as z from "zod";

// AUTH/DEVELOPER/PROFILE
export type DeveloperType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  name?: string;
  email: string;
  password?: string;
};

export const developerNameFormSchema = z.object({
  name: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
});

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
