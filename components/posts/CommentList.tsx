"use client";
import React from "react";

import CommentCard from "./CommentCard";
import NothingtoShow from "@/components/layout/NothingtoShow";
import GithubRepositoriesCardSkeleton from "../profile/GithubRepositories/GithubRepositoriesCardSkeleton";

import { getPostCommentsAction } from "@/utils/actions/";
import { useQuery } from "@tanstack/react-query";

const CommentList = ({ postId }: { postId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["postComments", postId],
    queryFn: () => getPostCommentsAction({ postId }),
  });

  const comments = data?.data || [];

  // display loaders when getting edutcation items
  if (isPending)
    return (
      <div className="flex flex-col gap-4 mt-4 w-full">
        <GithubRepositoriesCardSkeleton />
        <GithubRepositoriesCardSkeleton />
      </div>
    );

  // display when no comment item is created
  if (comments.length === 0) return <NothingtoShow />;

  return (
    <div className="flex flex-col w-full gap-4 py-2">
      {comments &&
        comments.map((comment) => (
          <CommentCard
            key={`${comment.$id}-comment-item`}
            comment={comment}
            postId={postId}
            commentCount={comments.length}
          />
        ))}
    </div>
  );
};
export default CommentList;
