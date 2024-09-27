"use server";
import {
  PostType,
  PostFormType,
  postFormSchema,
  DeveloperType,
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
    // Fetch developers
    const developers = await getDevelopersAction();

    // add developerName, liked, disLiked, mine and comments to post object
    const postsData: PostType[] = postsDocuments.map((post) => {
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
        commentCount: post.commentCount,
        developerId: post.developerId,
        developerName: postOwner.name,
        developerEmail: postOwner.email,
        mine: developer?.$id === post.developerId,
        likedBy: post.likedBy,
        disLikedBy: post.disLikedBy,
        liked: post.likedBy.includes(developer.$id), // Add 'liked' property to each post
        disLiked: post.disLikedBy.includes(developer.$id), // Add 'disLiked' property to each post
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
        developerId: response.developerId,
        developerName: response.developerName,
        developerEmail: developer.email,
        mine: developer?.$id === response.developerId,
        commentCount: response.commentCount,
        likedBy: response.likedBy,
        disLikedBy: response.disLikedBy,
        liked: response.likedBy.includes(developer.$id), // Add 'liked' property to each post
        disLiked: response.disLikedBy.includes(developer.$id), // Add 'disLiked' property to each post
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
