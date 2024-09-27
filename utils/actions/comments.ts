"use server";
import { PostCommentType, postCommentFormSchema } from "../types/";
import { ID } from "node-appwrite";
import { createSessionClient } from "../appwrite/";
import auth from "../appwrite/auth";
import { authenticateAndRedirect } from "./auth";

// POST LIKES/DISLIKES/COMMENTS
// Post comment
const createPostCommentAction = async ({
  comment,
  postId,
}: {
  comment: string;
  postId: string;
}): Promise<{
  data?: PostCommentType;
  error?: string;
}> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    postCommentFormSchema.parse({ comment, postId });
    const data = {
      comment,
      post: postId, // relationship
      developerId: developer.$id,
    };
    const { databases } = await createSessionClient(sessionCookie.value);
    // fetch post comments
    const responsePostCommentDocument = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      ID.unique(),
      data,
    );
    const postComment: PostCommentType = {
      $id: responsePostCommentDocument.$id,
      $createdAt: responsePostCommentDocument.$createdAt,
      $updatedAt: responsePostCommentDocument.$updatedAt,
      comment: responsePostCommentDocument.comment,
      developerId: responsePostCommentDocument.developerId,
      developerName: developer.name || "",
      developerEmail: developer.email || "",
      mine: developer?.$id === responsePostCommentDocument.developerId,
    };

    return { data: postComment };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// Delete post comment
const deletePostCommentAction = async ({
  id,
}: {
  id: string;
}): Promise<{
  data?: string;
  error?: string;
}> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      id,
    );
    return { data: id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  // POST COMMENTS
  createPostCommentAction,
  deletePostCommentAction,
};
