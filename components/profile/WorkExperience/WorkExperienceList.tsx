"use client";
import React from "react";
import PaginationContainer from "../../layout/PaginationContainer";
import WorkExperienceCard from "./WorkExperienceCard";
import WorkExperienceCardSkeleton from "../Education/EducationCardSkeleton";
import NothingtoShow from "../../layout/NothingtoShow";

import { useSearchParams } from "next/navigation";
import { getWorkExperienceAction } from "@/utils/actions/workExperience";
import { useQuery } from "@tanstack/react-query";

const WorkExperienceList = () => {
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;
  // get developerId from url
  const developerId = searchParams.get("developerId") || undefined;

  // get paginated work experience data
  const { data, isPending } = useQuery({
    queryKey: ["workExperience", pageNumber, developerId],
    queryFn: () => getWorkExperienceAction({ page: pageNumber, developerId }),
  });

  const workExperience = data?.data?.workExperience || [];
  const page = data?.data?.page || 0;
  const totalPages = data?.data?.totalPages || 0;

  // display loaders when getting work experience list
  if (isPending)
    return (
      <div className="flex flex-col gap-4 mt-4">
        <WorkExperienceCardSkeleton />
        <WorkExperienceCardSkeleton />
        <WorkExperienceCardSkeleton />
      </div>
    );

  // display when no work experience created
  if (workExperience.length < 1) return <NothingtoShow />;

  return (
    <>
      {totalPages < 2 ? null : (
        <div className="flex items-center my-2">
          <PaginationContainer currentPage={page} totalPages={totalPages} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {workExperience.map((workExperienceItem) => (
          <WorkExperienceCard
            key={`${workExperienceItem.$id}-workExperience-item`}
            workExperienceItem={workExperienceItem}
          />
        ))}
      </div>
    </>
  );
};
export default WorkExperienceList;
