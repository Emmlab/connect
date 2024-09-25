import * as z from 'zod';

// POST COMMENTS
export type PostCommentType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  comment: string;
  developerId: string;
  developerName: string;
  post?: string,
}

export const postCommentFormSchema = z.object({
  comment: z.string().min(2, {
    message: 'Field must be at least 2 characters.',
  })
});

export type PostCommentFormType = z.infer<typeof postCommentFormSchema>;

// POST LIKES/DISLIKES
export type PostLikeType = {
  $id?: string;
  $createdAt: string;
  $updatedAt: string;
  developerId: string;
}