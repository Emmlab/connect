"use server";
import {
  PostType,
  PostFormType,
  postFormSchema,
  DeveloperType,
  PostCommentType,
} from "../types/";
import { Query, ID } from "node-appwrite";
import { createSessionClient } from "../appwrite/";
import auth from "../appwrite/auth";
import { getDevelopersAction } from "./developer";
import { DEFAULT_PAGE_LIMIT } from "../magicValues";
import { authenticateAndRedirect } from "./auth";

// POSTS
// Get post
const getPostsAction = async ({
  page,
}: {
  page: number;
}): Promise<{
  data?: {
    posts: PostType[];
    count: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // fetch posts
    const { documents: postsDocuments, total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      [
        Query.orderDesc("$createdAt"),
        Query.limit(DEFAULT_PAGE_LIMIT),
        Query.offset((page - 1) * DEFAULT_PAGE_LIMIT),
      ],
    );
    const postIds = postsDocuments.map((post) => post.$id);

    // Fetch post likes and dislikes
    const { documents: userLikesDislikesDocuments } =
      await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "Likes",
        [Query.equal("post", postIds)],
      );
    const userLikesDislikes:
      | {
          developerId: string;
          post: PostType;
          isLiked: boolean;
        }[]
      | [] = userLikesDislikesDocuments.map(
      (userLikesDislikesDocumentsItem) => {
        return {
          developerId: userLikesDislikesDocumentsItem.developerId,
          post: userLikesDislikesDocumentsItem.post,
          isLiked: userLikesDislikesDocumentsItem.isLiked,
        };
      },
    );

    // array of liked post IDs
    const likedPostIds: (string | undefined)[] = [];
    // array of disliked post IDs
    const disLikedPostIds: (string | undefined)[] = [];
    userLikesDislikes.map((like) => {
      if (like.isLiked) {
        likedPostIds.push(like.post.$id);
        return like.post.$id;
      } else {
        disLikedPostIds.push(like.post.$id);
        return like.post.$id;
      }
    });

    // Fetch post comments
    const { documents: postCommentsDocuments } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      [Query.orderDesc("$createdAt"), Query.equal("post", postIds)],
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

    // add developerName, liked, disLiked, mine and comments to post object
    const postsData: PostType[] = postsDocuments.map((post) => {
      // get post comments
      const postItemComments: PostCommentType[] = [];
      postComments.map((postComment) => {
        if (postComment.post === post.$id) {
          postItemComments.push(postComment);
        }
        return postComment;
      });
      // get post username
      let postOwner = {
        name: "404",
        email: "",
      };
      if (developers?.data) {
        const postOwnerItem = developers?.data.filter(
          (developer: DeveloperType) => post.developerId === developer.$id,
        );
        if (postOwnerItem.length) {
          postOwner["name"] = postOwnerItem[0].name as string;
          postOwner["email"] = postOwnerItem[0].email as string;
        }
      }
      // create new post entry with missing values; developerName, liked, disLiked, mine and comments
      return {
        $id: post.$id,
        $createdAt: post.$createdAt,
        $updatedAt: post.$updatedAt,
        message: post.message,
        likesCount: post.likesCount,
        disLikesCount: post.disLikesCount,
        developerId: post.developerId,
        developerName: postOwner.name,
        developerEmail: postOwner.email,
        mine: developer?.$id === post.developerId,
        liked: likedPostIds.includes(post.$id), // Add 'liked' property to each post
        disLiked: disLikedPostIds.includes(post.$id), // Add 'disLiked' property to each post
        comments: postItemComments,
      };
    });

    return {
      data: {
        posts: postsData,
        count: total,
        page,
        totalPages: Math.ceil(total / DEFAULT_PAGE_LIMIT), // calculate total page count
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: { posts: [], count: 0, page: page, totalPages: 0 },
      error: "Something went wrong",
    };
  }
};

// Create post
const createPostAction = async (
  values: PostFormType,
): Promise<{
  data?: PostType;
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    postFormSchema.parse(values);

    const { databases } = await createSessionClient(sessionCookie.value);
    const data = {
      ...values,
      developerId: developer.$id,
    };
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      ID.unique(),
      data,
    );

    return {
      data: {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        message: response.message,
        likesCount: response.likesCount,
        disLikesCount: response.disLikesCount,
        developerId: response.developerId,
        developerName: response.developerName,
        developerEmail: developer.email,
        mine: developer?.$id === response.developerId,
        liked: response.liked,
        disLiked: response.disLiked,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// Delete post
const deletePostAction = async (
  id: string,
): Promise<{
  data?: string;
  error?: string;
}> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      id,
    );
    return { data: id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  // POSTS
  createPostAction,
  getPostsAction,
  deletePostAction,
};
