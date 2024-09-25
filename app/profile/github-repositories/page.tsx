import React from "react";
import GithubRepositories from "@/components/profile/GithubRepositories";
import { Suspense } from "react";
// Profile github repositories page
const GithubRepositoriesPage = () => (
  <Suspense>
    <GithubRepositories />
  </Suspense>
);

export default GithubRepositoriesPage;
