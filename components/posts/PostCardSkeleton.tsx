import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// post card loader
const PostCardSkeleton = () => {
  return (
    <div className="p-8 flex flex-col gap-4 rounded-lg border">
      <Skeleton className="h-5" />
      <Skeleton className="h-12" />
      <Skeleton className="h-5" />
    </div>
  );
};

export default PostCardSkeleton;
