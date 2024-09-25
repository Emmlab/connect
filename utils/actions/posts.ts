'use server';
import { PostType, PostFormType, postFormSchema } from '../types/posts';
import { DeveloperType } from '../types/developer';
import {  PostCommentType } from '../types/postLikesComments';
import { Query, ID } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import auth from "../auth";
import { authenticateAndRedirect, getDevelopersAction } from './developer';
import { DEFAULT_PAGE_LIMIT } from '../magicValues';


// POSTS
// Get post
const getPostsAction = async ({
  page,
  isDeveloper
}: {
  page: number;
  isDeveloper?: boolean;
}): Promise<{ 
      posts: PostType[];
      count: number;
      page: number;
      totalPages: number;
    } | null> => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(DEFAULT_PAGE_LIMIT),
        Query.offset((page - 1) * (DEFAULT_PAGE_LIMIT))
    ]
    // fetch logged in developer posts flag
    if (isDeveloper) {
      queries.push(Query.equal('developerId', [developer.$id as string]))
    }
    const { databases } = await createSessionClient(sessionCookie.value);
    // fetch posts
    const { documents: postsDocuments, total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      queries
    );
    
    // Fetch likes for the current user
    const postIds = postsDocuments.map(post => post.$id)
    const { documents: userLikes } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostLikes",
      [
        Query.equal('developerId', [developer.$id as string]),
        Query.equal('post', postIds)
      ]
    );
    // array of liked post IDs
    const likedPostIds = userLikes.map(like => like.post.$id)

    // Fetch dis likes for the current user
    const { documents: userDisLikes } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostDisLikes",
      [
        Query.equal('developerId', [developer.$id as string]),
        Query.equal('post', postIds)
      ]
    );
    // array of dis liked post IDs
    const disLikedPostIds = userDisLikes.map(disLike => disLike.post.$id)

    // Fetch post comments
    const { documents: postCommentsDocuments } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      [
        Query.orderDesc("$createdAt"),
        Query.equal('post', postIds)
      ]
    );

    // Fetch developers
    const developers = await getDevelopersAction()
    // map each post/user to their post comment
    const allPostComments: PostCommentType[] = postCommentsDocuments.map(postComment => {
      const postCommentOwner = developers?.users
        ? developers?.users.filter((developer: DeveloperType) => postComment.developerId === developer.$id)[0].name
        : null
      return  {
        $id: postComment.$id,
        $createdAt: postComment.$createdAt,
        $updatedAt: postComment.$updatedAt,
        comment: postComment.comment,
        developerId: postComment.developerId,
        developerName: postCommentOwner ? postCommentOwner : '',
        post: postComment.post.$id,
      }
    });
    
    // map each post comment/user to their post
    const postsWithLikedStatus: PostType[] = postsDocuments.map(post => {
      const postComments: PostCommentType[] = []
      allPostComments.map((postComment) => {
        if (postComment.post === post.$id) {
          postComments.push(postComment)
        }
        return postComment
      });
      const postOwner = developers?.users
        ? developers?.users.filter((developer: DeveloperType) => post.developerId === developer.$id)[0].name
        : null
      
      const postsWithLikedStatus =  {
        $id: post.$id,
        $createdAt: post.$createdAt,
        $updatedAt: post.$updatedAt,
        message: post.message,
        likesCount: post.likesCount,
        disLikesCount: post.disLikesCount,
        developerId: post.developerId,
        developerName: postOwner ? postOwner : '',
        liked: likedPostIds.includes(post.$id), // Add 'liked' property to each post
        disLiked: disLikedPostIds.includes(post.$id), // Add 'disLiked' property to each post
        comments: postComments
      }

      return postsWithLikedStatus
    });
    
    // calculate total page count
    const totalPages = Math.ceil(total / (DEFAULT_PAGE_LIMIT));
    return { 
      posts: postsWithLikedStatus,
      count: total,
      page,
      totalPages
    };
  } catch (error) {
    console.error(error);
    return { posts: [], count: 0, page: page, totalPages: 0 };
  }
}

// Create post
const createPostAction = async (values: PostFormType) => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    postFormSchema.parse(values);
    
    const { databases } = await createSessionClient(sessionCookie.value);
    const data = {
      ...values,
      developerId: developer.$id
    };
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      ID.unique(),
      data
    );
    return {}
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Delete post
const deletePostAction = async (id: string): Promise<string | null> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      id
    );
    return id
  } catch (error) {
    console.error(error);
    return null;
  }
}



export {
  // POSTS
  createPostAction,
  getPostsAction,
  deletePostAction,
}