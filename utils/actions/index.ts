'use server';
import {
  getDeveloper,
  authenticateAndRedirect,
  getDevelopersAction,
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
  developerLogoutAction,
  updateDeveloperName,
  getGithubDeveloperRepositories,
} from './developer';
import {
  getEducationAction,
  getEducationItemAction,
  createEducationAction,
  updateEducationItemAction,
  deleteEducationItemAction,
} from './education';
import {
  getWorkExperienceAction,
  getWorkExperienceItemAction,
  createWorkExperienceAction,
  updateWorkExperienceItemAction,
  deleteWorkExperienceItemAction,
} from './workExperience';
import {
  createPostAction,
  getPostsAction,
  deletePostAction,
} from './posts';
import {
  createPostCommentAction,
  deletePostCommentAction,
  postLikeAction,
  postDisLikeAction
} from './postLikesComments'


export {
  // AUTH
  authenticateAndRedirect,
  getDeveloper,
  getDevelopersAction,
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
  developerLogoutAction,
  updateDeveloperName,
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
  postDisLikeAction
}