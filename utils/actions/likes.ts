"use server";
import { createSessionClient } from "../appwrite/";
import auth from "../appwrite/auth";
import { authenticateAndRedirect } from "./auth";
import { PostType } from "../types";

// LIKE/DISLIKE POST
const postLikeDisLikeAction = async ({
  post,
  isLiking,
}: {
  post: PostType;
  isLiking: boolean;
}): Promise<{
  data?: PostType;
  error?: string;
}> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // get post likes/dislikes
    let newLikedBy: string[] = post.likedBy;
    let newDisLikedBy: string[] = post.disLikedBy;

    // if developerId in likedBy post field:
    if (developer.$id && post.likedBy.includes(developer.$id)) {
      // remove developerId from liked Developers list on post
      newLikedBy = newLikedBy.filter((dev) => dev !== developer.$id);
    }
    // if developerId in disLikedBy post field:
    if (developer.$id && post.disLikedBy.includes(developer.$id)) {
      // remove developerId from disliked Developers list on post
      newDisLikedBy = newDisLikedBy.filter((dev) => dev !== developer.$id);
    }

    // update respective list based on user action(isLiking)
    if (isLiking) {
      developer.$id && newLikedBy.push(developer.$id);
    } else {
      developer.$id && newDisLikedBy.push(developer.$id);
    }
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      post.$id,
      { likedBy: newLikedBy, disLikedBy: newDisLikedBy },
    );
    return {
      data: { ...post, likedBy: newLikedBy, disLikedBy: newDisLikedBy },
    };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export { postLikeDisLikeAction };
