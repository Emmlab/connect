'use server';
import { PostCommentType, postCommentFormSchema } from '../types/postLikesComments';
import { Query, ID } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import auth from "../auth";
import { authenticateAndRedirect } from './developer';


// POST LIKES/DISLIKES/COMMENTS
// Post comment
const createPostCommentAction = async (
  { comment, postId }: { comment: string; postId: string }
): Promise<PostCommentType | null> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    postCommentFormSchema.parse({comment, postId});
    const data = {
      comment,
      post: postId, // relationship
      developerId: developer.$id
    };
    const { databases } = await createSessionClient(sessionCookie.value);
    // fetch post comments
    const responsePostCommentDocument = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      ID.unique(),
      data
    );
    const postComment: PostCommentType = {
      $id: responsePostCommentDocument.$id,
      $createdAt: responsePostCommentDocument.$createdAt,
      $updatedAt: responsePostCommentDocument.$updatedAt,
      comment: responsePostCommentDocument.comment,
      developerId: responsePostCommentDocument.developerId,
      developerName: developer.name || '',
    };

    return postComment
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Delete post comment
const deletePostCommentAction = async ({ id } : { id: string }): Promise<string | null> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      id
    );
    return id
  } catch (error) {
    console.error(error);
    return null;
  }
}

// like post
const postLikeAction = async (
  { postId, isLiked, isDisLiked, likesCount, disLikesCount }:
  { postId: string; isLiked: boolean; isDisLiked: boolean; likesCount: number; disLikesCount: number }
): Promise<string | null> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const data = {
      post: postId, // relationship
      developerId: developer.$id
    };
    
    const { databases } = await createSessionClient(sessionCookie.value);
    // update likes count on post table
    let newLikesCount = likesCount
    let newDisLikesCount = disLikesCount
    if (isLiked) {
      // unlike
      // reduce like count
      newLikesCount = newLikesCount - 1
      // get postLikeItem
      const { documents: postLikeItem } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "PostLikes",
        [
          Query.equal('developerId', [developer.$id as string]),
          Query.equal('post', [postId as string])
        ]
      );
      
      if (postLikeItem.length === 1) {
        // delete like item
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "PostLikes",
          postLikeItem[0].$id
        );
      }
    } else {
      // reduce disLike count if isDisLiked
      if (isDisLiked) {
        newDisLikesCount = newDisLikesCount - 1
        // remove dislike
        // get postDisLikeItem
        const { documents: postDisLikeItem } = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "PostDisLikes",
          [
            Query.equal('developerId', [developer.$id as string]),
            Query.equal('post', [postId as string])
          ]
        );
        
        if (postDisLikeItem.length === 1) {
          // delete dis like item
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "PostDisLikes",
            postDisLikeItem[0].$id
          );
        }
      }

      // update like count
      newLikesCount = (newLikesCount + 1)
      // add like item
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "PostLikes",
        ID.unique(),
        data
      );
    }

    // update post like count
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { likesCount: newLikesCount, disLikesCount: newDisLikesCount }
    );
    return postId
  } catch (error) {
    console.error(error);
    return null;
  }
}

// dislike post
const postDisLikeAction = async (
  { postId, isLiked, isDisLiked, likesCount, disLikesCount }:
  { postId: string; isLiked: boolean; isDisLiked: boolean; likesCount: number; disLikesCount: number }
): Promise<string | null> => {
  const developer = await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const data = {
      post: postId, // relationship
      developerId: developer.$id
    };
    
    const { databases } = await createSessionClient(sessionCookie.value);
    // update dis likes count on post table
    let newDisLikesCount = disLikesCount
    let newLikesCount = likesCount
    if (isDisLiked) {
      // update dis like count
      newDisLikesCount = newDisLikesCount - 1
      // get postDisLikeItem
      const { documents: postDisLikeItem } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "PostDisLikes",
        [
          Query.equal('developerId', [developer.$id as string]),
          Query.equal('post', [postId as string])
        ]
      );
      
      if (postDisLikeItem.length === 1) {
        // delete dis like item
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "PostDisLikes",
          postDisLikeItem[0].$id
        );
      }
    } else {
      // reduce like count if isLiked
      if (isLiked) {
        // unlike
        newLikesCount = newLikesCount - 1
        // get postLikeItem
        const { documents: postLikeItem } = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "PostLikes",
          [
            Query.equal('developerId', [developer.$id as string]),
            Query.equal('post', [postId as string])
          ]
        );
        
        if (postLikeItem.length === 1) {
          // delete like item
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "PostLikes",
            postLikeItem[0].$id
          );
        }
      }

      // update dis like count
      newDisLikesCount = (newDisLikesCount + 1)
      // add dis like item
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "PostDisLikes",
        ID.unique(),
        data
      );
    }

    // update post dis like count
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      postId,
      { likesCount: newLikesCount, disLikesCount: newDisLikesCount }
    );
    return postId
  } catch (error) {
    console.error(error);
    return null;
  }
}


export {
  // POST LIKES/DISLIKE/COMMENTS
  createPostCommentAction,
  deletePostCommentAction,
  postLikeAction,
  postDisLikeAction
}