"use server";
import { Query, ID } from "node-appwrite";
import { createSessionClient } from "../appwrite/";
import auth from "../appwrite/auth";
import { authenticateAndRedirect } from "./auth";

// like post
const postLikeAction = async ({
  postId,
  isLiked,
  isDisLiked,
  likesCount,
  disLikesCount,
}: {
  postId: string;
  isLiked: boolean;
  isDisLiked: boolean;
  likesCount: number;
  disLikesCount: number;
}): Promise<{
  data?: string;
  error?: string;
}> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const data = {
      post: postId, // relationship
      developerId: developer.$id,
    };

    const { databases } = await createSessionClient(sessionCookie.value);
    // update likes count on post table
    let newLikesCount = likesCount;
    let newDisLikesCount = disLikesCount;

    // get postLikeDislikeItem
    const { documents: postLikeDislikeItem } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Likes",
      [
        Query.equal("developerId", [developer.$id as string]),
        Query.equal("post", [postId as string]),
      ],
    );

    // update likes/dislikes and post like/dislike count
    if (isLiked) {
      // unlike
      // reduce like count
      // get liked post like
      const postLikeItem = postLikeDislikeItem.filter(
        (item) => item.isLiked === true,
      );
      newLikesCount = newLikesCount - 1;
      if (postLikeItem.length === 1) {
        // delete like item
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "Likes",
          postLikeDislikeItem[0].$id,
        );
      }
      postLikeItem;
    } else {
      // reduce disLike count if isDisLiked
      if (isDisLiked) {
        newDisLikesCount = newDisLikesCount - 1;
        // remove dislike
        // // get postDisLikeItem
        const postDisLikeItem = postLikeDislikeItem.filter(
          (item) => !item.isLiked,
        );

        if (postDisLikeItem.length === 1) {
          // delete dis like item
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Likes",
            postDisLikeItem[0].$id,
          );
        }
      }

      // update like count
      newLikesCount = newLikesCount + 1;
      // add like item
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "Likes",
        ID.unique(),
        { ...data, isLiked: true },
      );
    }

    // update post like count
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { likesCount: newLikesCount, disLikesCount: newDisLikesCount },
    );
    return { data: postId };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// dislike post
const postDisLikeAction = async ({
  postId,
  isLiked,
  isDisLiked,
  likesCount,
  disLikesCount,
}: {
  postId: string;
  isLiked: boolean;
  isDisLiked: boolean;
  likesCount: number;
  disLikesCount: number;
}): Promise<{
  data?: string;
  error?: string;
}> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const data = {
      post: postId, // relationship
      developerId: developer.$id,
    };

    const { databases } = await createSessionClient(sessionCookie.value);
    // update dis likes count on post table
    let newDisLikesCount = disLikesCount;
    let newLikesCount = likesCount;

    // get postLikeDisLikeItem
    const { documents: postLikeDisLikeItem } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Likes",
      [
        Query.equal("developerId", [developer.$id as string]),
        Query.equal("post", [postId as string]),
      ],
    );

    if (isDisLiked) {
      // update dis like count
      newDisLikesCount = newDisLikesCount - 1;
      const postDisLikeItem = postLikeDisLikeItem.filter(
        (item) => !item.isLiked,
      );
      if (postDisLikeItem.length === 1) {
        // delete dis like item
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "Likes",
          postDisLikeItem[0].$id,
        );
      }
    } else {
      // reduce like count if isLiked
      if (isLiked) {
        // unlike
        newLikesCount = newLikesCount - 1;
        // get postLikeItem
        const postLikeItem = postLikeDisLikeItem.filter((item) => item.isLiked);

        if (postLikeItem.length === 1) {
          // delete like item
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Likes",
            postLikeItem[0].$id,
          );
        }
      }

      // update dis like count
      newDisLikesCount = newDisLikesCount + 1;
      // add dis like item
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "Likes",
        ID.unique(),
        { ...data, isLiked: false },
      );
    }

    // update post dis like count
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { likesCount: newLikesCount, disLikesCount: newDisLikesCount },
    );
    return { data: postId };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export { postLikeAction, postDisLikeAction };
