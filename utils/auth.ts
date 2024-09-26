import { cookies, headers } from "next/headers";
import { OAuthProvider, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./appwrite";
import {
  DeveloperType,
  GithubDeveloperType,
  GithubDeveloperRepositoriesType,
} from "./types/developer";

type SessionCookie = {
  name: string;
  value: string;
};

/* The Auth class provides methods for user authentication, session management, GitHub
profile retrieval, GitHub repository retrieval, GitHub OAuth authentication, and session deletion. */
class Auth {
  sessionCookie: null | SessionCookie;
  user: null | DeveloperType;
  constructor() {
    this.sessionCookie = null;
    this.user = null;
  }

  // get authenticated user session
  getSession() {
    this.sessionCookie = cookies().get("session") as SessionCookie;
    return this.sessionCookie;
  }

  async getDeveloper() {
    this.getSession();
    try {
      if (this.sessionCookie) {
        const { account } = await createSessionClient(this.sessionCookie.value);
        this.user = await account.get();
      } else {
        this.user = null;
      }
    } catch {
      this.user = null;
      this.sessionCookie = null;
    }
    return this.user;
  }

  async developerSignup({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    "use server";
    const { account } = await createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);
    return user;
  }

  async developerLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { account } = await createAdminClient();
    const userWithSecret = await account.createEmailPasswordSession(
      email,
      password,
    );

    cookies().set("session", userWithSecret.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(userWithSecret.expire),
      path: "/",
    });
    return userWithSecret;
  }

  async updateDeveloperName(developerId: string, name: string) {
    "use server";
    const { users } = await createAdminClient();
    await users.updateName(
      developerId, // userId
      name, // name
    );
    return null;
  }

  async updateDeveloperPassword(developerId: string, password: string) {
    "use server";
    const { users } = await createAdminClient();
    await users.updatePassword(
      developerId, // userId
      password, // name
    );
    return null;
  }

  // get github profile using email
  async getGithubDeveloperProfile(
    email: string,
  ): Promise<GithubDeveloperType | null> {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${email}`,
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // get github repositories using email
  async getGithubDeveloperRepositories(
    name: string,
  ): Promise<GithubDeveloperRepositoriesType[] | null> {
    try {
      const response = await fetch(
        `https://api.github.com/users/${name}/repos`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Signup/Login using github OAuth
  async githubAuth() {
    "use server";
    const headersList = headers();
    const fullUrl = headersList.get("referer") || "";
    const failureUrl = `${fullUrl}failure`;
    const { account } = await createAdminClient();
    let redirectUrl = null;
    try {
      redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Github,
        fullUrl, // Callback URL for success
        failureUrl, // Callback URL for failure
        ["public_repo", "user"],
      );
    } catch (error) {
      console.log({ error });
    }
    return redirectUrl;
  }

  // github OAuth callback function
  async githubAuthCallback({
    userId,
    secret,
  }: {
    userId: string;
    secret: string;
  }) {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
  }

  // delete logged in user session
  async deleteSession() {
    "use server";
    this.getSession();
    if (this.sessionCookie) {
      const { account } = await createSessionClient(this.sessionCookie.value);
      await account.deleteSession("current");
    }

    cookies().delete("session");
    this.user = null;
    this.sessionCookie = null;
  }
}

const auth = new Auth();

export default auth;
