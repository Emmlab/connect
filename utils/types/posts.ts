import * as z from "zod";
import { PostCommentType } from "./comments";

// POSTS TYPES
export type PostType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  message: string;
  likesCount: number;
  disLikesCount: number;
  developerId: string;
  developerName: string;
  developerEmail: string;
  liked: boolean;
  disLiked: boolean;
  mine: boolean;
  comments?: PostCommentType[];
};

export type PostFormType = z.infer<typeof postFormSchema>;

// POSTS SCHEMA
export const postFormSchema = z.object({
  message: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
});
