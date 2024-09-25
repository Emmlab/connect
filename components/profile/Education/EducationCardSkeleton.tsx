import React from "react";
import { Skeleton } from "../../ui/skeleton";

// education card loader
const EducationCardSkeleton = () => {
  return (
    <div className="p-2 md:px-5 flex flex-col gap-4 rounded-lg border border-slate-400">
      <Skeleton className="h-8 bg-slate-400" />
      <Skeleton className="h-5 bg-slate-400 md:ml-[48px]" />
    </div>
  );
};

export default EducationCardSkeleton;
