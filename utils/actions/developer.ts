'use server';
import { redirect } from 'next/navigation';
import { DeveloperType, GithubDeveloperRepositoriesType } from '../types/developer';
import auth from "../auth";


const getDeveloper = async () => {
  const developer: DeveloperType | null = await auth.getDeveloper();
  return developer
}

const authenticateAndRedirect = async () => {
  const developer =  await getDeveloper()
  if (!developer || (developer && !developer?.name)) {
    redirect('/');
  }
  return developer;
}

// github auth
const developerGithubLoginAction = async () =>  {
  try {
    const redirectUrl = await auth.githubAuth()
    return redirectUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// github auth callback
const developerGithubLoginCallbackAction = async ({ userId, secret }: { userId?: string; secret?: string; }):
  Promise<DeveloperType | null> =>  {
  if (!userId || !secret) {
      return null
    }
  try {
    await auth.githubAuthCallback({ userId, secret })
    const developer = await getDeveloper();
    return developer
  } catch (error) {
    console.error(error);
    return null;
  }
}

// developer logout
const developerLogoutAction = async () => {
  try {
    await auth.deleteSession();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// get all developers using a cloud function
const getDevelopersAction = async (): Promise<{ users: DeveloperType[] } | null> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APPWRITE_USERS_FUNCTION_URL as string);
    const data = await response.json()
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// update developer name
const updateDeveloperName = async ({ name }: { name: string }): Promise<string | null> => {
  try {
    const developer = await authenticateAndRedirect();
    await auth.updateDeveloperName(developer.$id as string, name)
    return name
  } catch (error) {
    console.error(error);
    return null;
  }
}

// get developer repositories
const getGithubDeveloperRepositories = async ({ email }: { email: string }): Promise<GithubDeveloperRepositoriesType[] | [] |null> => {
  try {
    // GET github username from developer profile
    const githubDeveloperProfile = await auth.getGithubDeveloperProfile(email as string)
    // GET repositories using github username
    const githubDeveloperRepositoriesResponse =
      await auth.getGithubDeveloperRepositories(githubDeveloperProfile?.items[0].login as string)
    
    let githubDeveloperRepositories: GithubDeveloperRepositoriesType[] | [] = []
    if (githubDeveloperRepositoriesResponse) {
      githubDeveloperRepositories = githubDeveloperRepositoriesResponse
        .map(githubDeveloperRepository => ({
          id: githubDeveloperRepository.id,
          name: githubDeveloperRepository.name,
          html_url: githubDeveloperRepository.html_url,
          description: githubDeveloperRepository.description,
          created_at: githubDeveloperRepository.created_at,
          language: githubDeveloperRepository.language
      }));
    }
    return githubDeveloperRepositories
  } catch (error) {
    console.error(error);
    return null;
  }
}


export {
  // developer
  authenticateAndRedirect,
  getDeveloper,
  getDevelopersAction,
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
  developerLogoutAction,
  updateDeveloperName,
  getGithubDeveloperRepositories,
}