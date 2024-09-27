"use server";
import {
  developerFormSchema,
  DeveloperFormType,
  DeveloperType,
  GithubDeveloperRepositoriesType,
} from "../types/";
import auth from "../appwrite/auth";
import { authenticateAndRedirect, getAuthenticatedDeveloper } from "./auth";

// get all developers using a cloud function
const getDevelopersAction = async (
  noLoggedInUser?: boolean,
): Promise<{
  data?: DeveloperType[];
  error?: string;
}> => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_APPWRITE_USERS_FUNCTION_URL as string,
    );
    const userDocuments = await response.json();
    let usersData = userDocuments.users;
    if (noLoggedInUser) {
      // remove logged in developer from list
      const developer = await getAuthenticatedDeveloper();
      if (developer?.$id) {
        usersData = userDocuments.users.filter(
          (user: DeveloperType) => user.$id !== developer.$id,
        );
      }
    }

    return { data: usersData };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// update developer name
const updateDeveloper = async (
  values: DeveloperFormType,
): Promise<{ data?: string; error?: string }> => {
  try {
    developerFormSchema.parse(values);
    const developer = await authenticateAndRedirect();
    await auth.updateDeveloperName(developer.$id as string, values.name);
    values.password &&
      (await auth.updateDeveloperPassword(
        developer.$id as string,
        values.password,
      ));

    return { data: values.name };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// get developer repositories
const getDeveloperGithubRepositories = async ({
  email,
}: {
  email: string;
}): Promise<{ data?: GithubDeveloperRepositoriesType[]; error?: string }> => {
  try {
    // GET github username from developer profile
    const githubDeveloperProfile = await auth.getGithubDeveloperProfile(
      email as string,
    );

    let githubDeveloperRepositories: GithubDeveloperRepositoriesType[] | [] =
      [];
    if (
      githubDeveloperProfile?.items &&
      githubDeveloperProfile?.items.length > 0
    ) {
      // GET repositories using github username
      let githubDeveloperProfileName = null;
      if (githubDeveloperProfile?.items.length) {
        githubDeveloperProfileName = githubDeveloperProfile?.items[0]
          .login as string;
      }

      if (githubDeveloperProfileName) {
        const githubDeveloperRepositoriesResponse =
          await auth.getDeveloperGithubRepositories(githubDeveloperProfileName);

        if (githubDeveloperRepositoriesResponse) {
          githubDeveloperRepositories = githubDeveloperRepositoriesResponse.map(
            (githubDeveloperRepository) => ({
              id: githubDeveloperRepository.id,
              name: githubDeveloperRepository.name,
              html_url: githubDeveloperRepository.html_url,
              description: githubDeveloperRepository.description,
              created_at: githubDeveloperRepository.created_at,
              language: githubDeveloperRepository.language,
            }),
          );
        }
      }
    }

    return { data: githubDeveloperRepositories };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  // developer
  getDevelopersAction,
  updateDeveloper,
  getDeveloperGithubRepositories,
};
