import React from "react";
import { Skeleton } from "../ui/skeleton";

// developer card loader
const DeveloperCardSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-md py-4 px-2 border border-slate-400">
      <Skeleton className="rounded-full p-4 bg-slate-400 w-[40px] h-[40px]" />
      <Skeleton className="flex-grow h-5 bg-slate-400" />
    </div>
  );
};

export default DeveloperCardSkeleton;
