"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import PostCard from "./PostCard";
import { CornerLeftUp } from "lucide-react";
import PostCardSkeleton from "./PostCardSkeleton";
import PaginationContainer from "@/components/layout/PaginationContainer";
import { getAuthenticatedDeveloper, getPostsAction } from "@/utils/actions/";

const Posts = () => {
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;

  // get paginated posts
  const { data, isPending } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => getPostsAction({ page: pageNumber }),
  });

  // get developer
  const { data: developerData } = useQuery({
    queryKey: ["developer", 1],
    queryFn: () => getAuthenticatedDeveloper(),
  });

  const posts = data?.data?.posts || [];
  const page = data?.data?.page || 0;
  const totalPages = data?.data?.totalPages || 0;

  // display loaders when getting posts
  if (isPending)
    return (
      <div className="flex flex-col gap-4 mt-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );

  // display when no comments exist
  if (posts.length < 1)
    return (
      <div className="flex flex-col justify-center rounded-md border mt-4 pt-12 pb-12">
        <div className="flex gap-x-2 mx-auto my-2">
          <CornerLeftUp className="animate-bounce" />{" "}
          <span className="capitalize mt-2">Create Post</span>
        </div>
      </div>
    );

  return (
    <>
      {totalPages < 2 ? null : (
        <div className="flex items-center my-4">
          <PaginationContainer currentPage={page} totalPages={totalPages} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {developerData?.$id &&
          posts.map((post) => (
            <PostCard key={`${post.$id}-post-item`} post={post} />
          ))}
      </div>
    </>
  );
};

export default Posts;
