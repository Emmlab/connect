import * as z from "zod";

// WORK EXPERIENCE
export type WorkExperienceType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  developerId: string;
};

export const workExperienceFormSchema = z.object({
  company: z.string().min(1, {
    message: "Field must be at least 1 characters.",
  }),
  role: z.string().min(2, {
    message: "Field must be at least 1 characters.",
  }),
  description: z.string().min(5, {
    message: "Field must be at least 5 characters.",
  }),
});

export type WorkExperienceFormType = z.infer<typeof workExperienceFormSchema>;
