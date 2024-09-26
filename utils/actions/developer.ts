"use server";
import { redirect } from "next/navigation";
import {
  developerFormSchema,
  DeveloperFormType,
  DeveloperType,
  GithubDeveloperRepositoriesType,
  GithubDeveloperType,
  loginFormSchema,
  LoginFormType,
  signupFormSchema,
  SignupFormType,
} from "../types/developer";
import auth from "../auth";

const getDeveloper = async () => {
  const developer: DeveloperType | null = await auth.getDeveloper();
  return developer;
};

const authenticateAndRedirect = async () => {
  const developer = await getDeveloper();

  if (!developer || (developer && !developer?.name)) {
    redirect("/");
  }
  return developer;
};

// signup
const developerSignupAction = async (
  values: SignupFormType,
): Promise<{
  data?: unknown;
  error?: string;
}> => {
  try {
    // values validation
    signupFormSchema.parse(values);
    // github email validation
    const suspectedGithubUser: GithubDeveloperType | null =
      await auth.getGithubDeveloperProfile(values.email);

    if (suspectedGithubUser?.total_count === 0) {
      // user is not a valid github user
      return { error: "Signup failed. Please use a valid github Email." };
    }
    await auth.developerSignup(values);
    const loginResponse = await auth.developerLogin({
      email: values.email,
      password: values.password,
    });
    return { data: loginResponse };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// login
const developerLoginAction = async (
  values: LoginFormType,
): Promise<{
  data?: any;
  error?: string;
}> => {
  try {
    loginFormSchema.parse(values);
    const response = await auth.developerLogin(values);
    return { data: response };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// developer logout
const developerLogoutAction = async (): Promise<{
  data?: null;
  error?: string;
}> => {
  try {
    await auth.deleteSession();
    return { data: null };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

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
      const developer = await getDeveloper();
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
const getGithubDeveloperRepositories = async ({
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
          await auth.getGithubDeveloperRepositories(githubDeveloperProfileName);

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
  authenticateAndRedirect,
  getDeveloper,
  getDevelopersAction,
  developerSignupAction,
  developerLoginAction,
  developerLogoutAction,
  updateDeveloper,
  getGithubDeveloperRepositories,
};
