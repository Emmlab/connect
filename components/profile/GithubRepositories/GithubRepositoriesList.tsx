"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperGithubRepositories } from "@/utils/actions/";

import GithubRepositoriesCard from "./GithubRepositoriesCard";
import GithubRepositoriesCardSkeleton from "./GithubRepositoriesCardSkeleton";
import NothingtoShow from "@/components/layout/NothingtoShow";

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
      getDeveloperGithubRepositories({ email: developerEmail as string }),
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
  if (
    !githubDeveloperRepositories?.data ||
    githubDeveloperRepositories?.data.length < 1
  )
    return <NothingtoShow />;

  return (
    <div className="flex flex-col gap-2">
      {githubDeveloperRepositories?.data.map((repositoryItem) => (
        <GithubRepositoriesCard
          key={`${repositoryItem.id}-repository-item`}
          repositoryItem={repositoryItem}
        />
      ))}
    </div>
  );
};
export default GithubRepositoriesList;
