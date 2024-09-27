import * as z from "zod";

// POST COMMENTS TYPES
export type PostCommentType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  comment: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  post?: string;
  mine: boolean;
};

export type PostCommentFormType = z.infer<typeof postCommentFormSchema>;

// POST COMMENTS zod infer type
export const postCommentFormSchema = z.object({
  comment: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
});
