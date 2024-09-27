"use server";
import { redirect } from "next/navigation";
import {
  DeveloperType,
  GithubDeveloperType,
  loginFormSchema,
  LoginFormType,
  signupFormSchema,
  SignupFormType,
} from "../types/";
import auth from "../appwrite/auth";

// get authenticated developer
const getAuthenticatedDeveloper = async () => {
  const developer: DeveloperType | null = await auth.getDeveloper();
  return developer;
};

// control pages a user can access
const authenticateAndRedirect = async () => {
  const developer = await getAuthenticatedDeveloper();

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
      return {
        error: "Signup failed. Please use a valid PUBLIC GITHUB EMAIL.",
      };
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
    return { error: "Wrong credentails. Login failed." };
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
    return { error: "Logout failed." };
  }
};

// github auth
const developerGithubLoginAction = async (): Promise<{
  data?: string;
  error?: string;
}> => {
  try {
    const redirectUrl = await auth.githubAuth();
    return { data: redirectUrl as string };
  } catch (error) {
    console.error(error);
    return {
      error:
        "We encountered an error authorizing your Github account. Please use Email/Password Authentication.",
    };
  }
};

// github auth callback
const developerGithubLoginCallbackAction = async ({
  userId,
  secret,
}: {
  userId?: string;
  secret?: string;
}): Promise<DeveloperType | null> => {
  if (!userId || !secret) {
    return null;
  }
  try {
    await auth.githubAuthCallback({ userId, secret });
    const developer = await getAuthenticatedDeveloper();
    return developer;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  // developer
  getAuthenticatedDeveloper,
  authenticateAndRedirect,
  developerSignupAction,
  developerLoginAction,
  developerLogoutAction,
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
};
