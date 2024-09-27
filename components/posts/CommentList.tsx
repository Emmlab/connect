"use client";
import React from "react";
import CommentCard from "./CommentCard";
import NothingtoShow from "@/components/layout/NothingtoShow";
import { PostCommentType } from "@/utils/types/";

const CommentList = ({ comments }: { comments: PostCommentType[] }) => {
  if (comments.length === 0) return <NothingtoShow />;

  return (
    <div className="flex flex-col w-full gap-4 py-2">
      {comments &&
        comments.map((comment) => (
          <CommentCard key={`${comment.$id}-comment-item`} comment={comment} />
        ))}
    </div>
  );
};
export default CommentList;
