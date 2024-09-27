import * as z from "zod";

// EDUCATION TYPES
export type EducationType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  school: string;
  course: string;
  startDate: string;
  endDate: string;
  developerId: string;
};

export type EducationFormType = z.infer<typeof educationFormSchema>;

// EDUCATION SCHEMA
export const educationFormSchema = z.object({
  school: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
  course: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
});
