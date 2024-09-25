import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// comment card loader
const CommentCardSkeleton = () => {
  return (
    <div className="p-8 flex flex-col gap-4 rounded-lg border border-slate-400 ">
      <Skeleton className="h-5 bg-slate-400 " />
      <Skeleton className="h-12 bg-slate-400 " />
      <Skeleton className="h-6 bg-slate-400 " />
    </div>
  );
};

export default CommentCardSkeleton;
