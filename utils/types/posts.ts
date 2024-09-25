import * as z from 'zod';
import { PostCommentType } from './postLikesComments'

// POSTS
export type PostType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  message: string;
  likesCount: number;
  disLikesCount: number;
  developerId: string;
  developerName: string;
  liked: boolean;
  disLiked: boolean;
  comments?: PostCommentType[];
};

export const postFormSchema = z.object({
  message: z.string().min(2, {
    message: 'Field must be at least 2 characters.',
  })
});

export type PostFormType = z.infer<typeof postFormSchema>;

