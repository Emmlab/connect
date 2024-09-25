"use client";
import React from "react";
import { getGithubDeveloperRepositories } from "@/utils/actions/";
import { useQuery } from "@tanstack/react-query";

import GithubRepositoriesCard from "./GithubRepositoriesCard";
import GithubRepositoriesCardSkeleton from "./GithubRepositoriesCardSkeleton";
import NothingtoShow from "../../layout/NothingtoShow";

const GithubRepositoriesList = ({
  developerEmail,
}: {
  developerEmail: string;
}) => {
  // get repositories based on developerEmail
  const {
    data: githubDeveloperRepositories,
    isPending: isPendingGithubDeveloperRepositories,
  } = useQuery({
    queryKey: ["repositories", developerEmail],
    queryFn: () =>
      getGithubDeveloperRepositories({ email: developerEmail as string }),
    enabled: !!developerEmail,
  });

  // repositories list loader
  if (isPendingGithubDeveloperRepositories)
    return (
      <div className="flex flex-col gap-4 mt-4 w-full">
        <GithubRepositoriesCardSkeleton />
        <GithubRepositoriesCardSkeleton />
      </div>
    );

  // no repositories element
  if (!githubDeveloperRepositories || githubDeveloperRepositories.length < 1)
    return <NothingtoShow />;

  return (
    <div className="flex flex-col gap-2">
      {githubDeveloperRepositories.map((repositoryItem) => (
        <GithubRepositoriesCard
          key={`${repositoryItem.id}-repository-item`}
          repositoryItem={repositoryItem}
        />
      ))}
    </div>
  );
};
export default GithubRepositoriesList;
