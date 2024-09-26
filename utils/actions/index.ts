"use server";
import {
  getDeveloper,
  authenticateAndRedirect,
  getDevelopersAction,
  developerSignupAction,
  developerLoginAction,
  developerLogoutAction,
  updateDeveloper,
  getGithubDeveloperRepositories,
} from "./developer";
import {
  getEducationAction,
  getEducationItemAction,
  createEducationAction,
  updateEducationItemAction,
  deleteEducationItemAction,
} from "./education";
import {
  getWorkExperienceAction,
  getWorkExperienceItemAction,
  createWorkExperienceAction,
  updateWorkExperienceItemAction,
  deleteWorkExperienceItemAction,
} from "./workExperience";
import { createPostAction, getPostsAction, deletePostAction } from "./posts";
import {
  createPostCommentAction,
  deletePostCommentAction,
  postLikeAction,
  postDisLikeAction,
} from "./postLikesComments";

export {
  // AUTH
  authenticateAndRedirect,
  getDeveloper,
  getDevelopersAction,
  developerSignupAction,
  developerLoginAction,
  developerLogoutAction,
  updateDeveloper,
  getGithubDeveloperRepositories,
  //EDUCATION
  getEducationAction,
  getEducationItemAction,
  createEducationAction,
  updateEducationItemAction,
  deleteEducationItemAction,
  //WORK EXPERIENCE
  getWorkExperienceAction,
  getWorkExperienceItemAction,
  createWorkExperienceAction,
  updateWorkExperienceItemAction,
  deleteWorkExperienceItemAction,
  // POSTS
  createPostAction,
  getPostsAction,
  deletePostAction,
  // POST LIKES/COMMENTS
  createPostCommentAction,
  deletePostCommentAction,
  postLikeAction,
  postDisLikeAction,
};
