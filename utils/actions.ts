'use server';

import { PostType, DeveloperType, CreateAndEditPostType, createAndEditPostSchema, profileSchema, developerLoginSchema } from './types';
import { redirect } from 'next/navigation';
import { Databases, Query, OAuthProvider } from "appwrite";
import { client, account, ID } from "./appwrite";

const database = new Databases(client);

const authenticateAndRedirect = () : DeveloperType => {
  // get user details in localstorage or zustand store
  const developer = JSON.parse(window.localStorage.getItem('developer') || "{}");
  if (!developer || !developer.name) {
    return redirect('/');
  }
  return developer;
}

const developerLoginAction = async(
  values: DeveloperType
): Promise<DeveloperType | null> => {
  try {
    developerLoginSchema.parse(values);
    await account.createEmailPasswordSession(values.email, values.password || '');
    const developer: DeveloperType = await account.get();
    // save user details in localstorage or zustand store
    localStorage.setItem('developer', JSON.stringify(developer));
    return developer;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const developerSignupAction = async (
  values: DeveloperType
): Promise<DeveloperType | null> => {
  try {
    // validation
    profileSchema.parse(values);
    await account.create(ID.unique(), values.email, values.password || '', values.name);
    const developer = await developerLoginAction({ email: values.email, password: values.password });
    return developer;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const developerLogoutAction = async (): Promise<null> => {
  try {
    await account.deleteSession("current");
    // delete user from localstorage or zustand store
    window.localStorage.removeItem("developer")
    redirect('/');
  } catch (error) {
    console.error(error);
    return null;
  }
}

// TODO: github auth
const developerGithubLoginAction = async () =>  {
  try {
    const response = await account.createOAuth2Session(
        OAuthProvider.Github,
        "http://localhost:8000/?success", // Callback URL for success
        "http://localhost:8000/?failure", // Callback URL for failure
        ['repo', 'user']
    );
    console.log({response});
    
    // localStorage.setItem('developer', JSON.stringify(response));
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// TODO: get all users

// TODO: edit user; might do away with

// TODO: create education

// TODO: edit education

// TODO: delete education

// TODO: create work experience

// TODO: edit work experience

// TODO: delete work experience

// TODO: validate username to match their username before fetching repos
// const fetchDeveloperData = async (username: string) => {
//     const response = await fetch(`https://api.github.com/users/${username}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     return response.json();
//   };
// TODO: fetch github repositories:
// const fetchDeveloperRepos = async (username: string) => {
//     const response = await fetch(`https://api.github.com/users/${username}/repos`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     return response.json();
// };

const createPostAction = async (
  values: CreateAndEditPostType
): Promise<PostType | null> => {
  const developer = authenticateAndRedirect();
  try {
    createAndEditPostSchema.parse(values);
    const data = { ...values, developer: developer.id };
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      ID.unique(),
      data
    );
    console.log({response});
    
    return null
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getPostsAction = async ({
  page = 1,
  limit = 10,
  isDeveloper
}: {
  page?: number;
  limit?: number;
  isDeveloper?: boolean;
}): Promise<{
  posts: PostType[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  const developer = authenticateAndRedirect();
  try {
    const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(10),
        Query.offset((page - 1) * limit)
    ]
    if (isDeveloper) {
      queries.push(Query.equal('developer', [developer.id as string]))
    }
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      queries
    );
    console.log({response});
    // TODO: calculate total post count
    const count = 0
    // calculate total page count
    const totalPages = Math.ceil(count / limit);
    // return { posts, count, page, totalPages };
    return { posts: [], count: 0, page: 1, totalPages }
  } catch (error) {
    console.error(error);
    return { posts: [], count: 0, page: 1, totalPages: 0 };
  }
}

const getPostAction = async (id: string): Promise<PostType | null> => {
  let post: PostType | null = null;
  authenticateAndRedirect();

  try {
    const response = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      id
    );
    console.log({response});
    // post = response
  } catch (error) {
    post = null;
  }
  if (!post) {
    redirect('/posts');
  }
  return post;
}

const deletePostAction = async (id: string): Promise<PostType | null> => {
  authenticateAndRedirect();
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      id
    );
    console.log({response});
    return null
  } catch (error) {
    return null;
  }
}

const updatePostAction = async (
  id: string,
  values: CreateAndEditPostType
): Promise<PostType | null> => {
  const developer = authenticateAndRedirect();
  try {
    const data = {
      ...values,
      developer: developer.id
    };
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      id,
      data
    );
    console.log({response});
    
    return null
  } catch (error) {
    return null;
  }
}

const createPostCommentAction = async (
  {comment, commentCount, postId}: { comment: string, commentCount: number, postId: string }
): Promise<PostType | null> => {
  const developer = authenticateAndRedirect();
  try {
    createAndEditPostSchema.parse({comment, postId});
    const data = {
      comment,
      post: [postId], // relationship
      developer: developer.id
    };
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      ID.unique(),
      data
    );
    console.log({response});
    // TODO: update comment count on post table
    const commentId = response.id
    const postsUpdateResponse = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      commentId,
      { comments: commentCount }
    );
    console.log({postsUpdateResponse});
    return null
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getPostCommentsAction = async ({
  page = 1,
  limit = 10,
  postId
}: {
  page?: number;
  limit?: number;
  postId: string;
}): Promise<{
  postComments: { comment: string }[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  authenticateAndRedirect();
  try {
    const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(10),
        Query.offset((page - 1) * limit),
        Query.equal('post', [postId])
    ]
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Posts",
      queries
    );
    console.log({response});
    // TODO: calculate total post count
    const count = 0
    // calculate total page count
    const totalPages = Math.ceil(count / limit);
    // return { posts, count, page, totalPages };
    return { postComments: [], count: 0, page: 1, totalPages }
  } catch (error) {
    console.error(error);
    return { postComments: [], count: 0, page: 1, totalPages: 0 };
  }
}

const deletePostCommentAction = async (id: string): Promise<PostType | null> => {
  authenticateAndRedirect();
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostComments",
      id
    );
    // TODO: update comment count on post table
    console.log({response});
    return null
  } catch (error) {
    return null;
  }
}

const postLikeAction = async (
  {postId}: { postId: string }
): Promise<PostType | null> => {
  const developer = authenticateAndRedirect();
  try {
    // TODO: check if user liked post before

    const data = {
      post: [postId], // relationship
      developer: developer.id
    };
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "PostLikes",
      ID.unique(),
      data
    );

    // TODO: update likes count on post table

    console.log({response});
    return null
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  developerLoginAction,
  developerSignupAction,
  developerLogoutAction,
  createPostAction,
  getPostsAction,
  deletePostAction,
  getPostAction,
  updatePostAction,
  createPostCommentAction,
  getPostCommentsAction, 
  deletePostCommentAction,
  postLikeAction
}