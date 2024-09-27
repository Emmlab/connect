"use server";
import {
  DeveloperType,
  PostCommentType,
  postCommentFormSchema,
} from "../types/";
import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/";
import auth from "../appwrite/auth";
import { authenticateAndRedirect } from "./auth";
import { getDevelopersAction } from "./developer";

// POST LIKES/DISLIKES/COMMENTS
// GET post comment
const getPostCommentsAction = async ({
  postId,
}: {
  postId: string;
}): Promise<{
  data?: PostCommentType[];
  error?: string;
}> => {
  const developer = await authenticateAndRedirect();
  try {
    const { databases } = await createAdminClient();

    // Fetch post comments
    const { documents: postCommentsDocuments } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      [Query.orderDesc("$createdAt"), Query.equal("post", [postId])],
    );

    // Fetch developers
    const developers = await getDevelopersAction();

    // map each post/user to their post comment
    const postComments: PostCommentType[] = postCommentsDocuments.map(
      (postComment) => {
        // get post comment owner name
        const postCommentOwner = {
          name: "404",
          email: "",
        };
        if (!developers?.error && developers?.data) {
          const postCommentOwnerItem = developers?.data.filter(
            (developer: DeveloperType) =>
              postComment.developerId === developer.$id,
          );
          if (postCommentOwnerItem.length) {
            postCommentOwner["name"] = postCommentOwnerItem[0].name as string;
            postCommentOwner["email"] = postCommentOwnerItem[0].email as string;
          }
        }

        return {
          $id: postComment.$id,
          $createdAt: postComment.$createdAt,
          $updatedAt: postComment.$updatedAt,
          comment: postComment.comment,
          developerId: postComment.developerId,
          developerName: postCommentOwner.name,
          developerEmail: postCommentOwner.email,
          mine: developer?.$id === postComment.developerId,
          post: postComment.post.$id,
        };
      },
    );

    return { data: postComments };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
    };
  }
};

// Post comment
const createPostCommentAction = async ({
  comment,
  postId,
  commentCount,
}: {
  comment: string;
  postId: string;
  commentCount: number;
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

    // update post commentCount
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { commentCount: commentCount + 1 },
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
  postId,
  commentCount,
}: {
  id: string;
  postId: string;
  commentCount: number;
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

    // update post commentCount
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { commentCount: commentCount - 1 },
    );

    return { data: id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  // POST COMMENTS
  getPostCommentsAction,
  createPostCommentAction,
  deletePostCommentAction,
};
