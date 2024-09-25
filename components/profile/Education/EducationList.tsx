"use client";
import React from "react";

import PaginationContainer from "../../layout/PaginationContainer";
import EducationCard from "./EducationCard";
import EducationCardSkeleton from "./EducationCardSkeleton";
import NothingtoShow from "../../layout/NothingtoShow";

import { useSearchParams } from "next/navigation";
import { getEducationAction } from "@/utils/actions/education";
import { useQuery } from "@tanstack/react-query";

const EducationList = () => {
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;
  // get developerId from url
  const developerId = searchParams.get("developerId") || undefined;

  const { data, isPending } = useQuery({
    queryKey: ["education", pageNumber],
    queryFn: () => getEducationAction({ page: pageNumber, developerId }),
  });

  const education = data?.education || [];
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  // display loaders when getting edutcation items
  if (isPending)
    return (
      <div className="flex flex-col gap-4 mt-4 w-full">
        <EducationCardSkeleton />
        <EducationCardSkeleton />
      </div>
    );

  // display when no education item is created
  if (education.length < 1) return <NothingtoShow />;

  return (
    <>
      {totalPages < 2 ? null : (
        <div className="flex items-center my-2">
          <PaginationContainer currentPage={page} totalPages={totalPages} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {education.map((educationItem) => {
          return (
            <EducationCard
              key={`${educationItem.$id}-education-item`}
              educationItem={educationItem}
            />
          );
        })}
      </div>
    </>
  );
};
export default EducationList;
