import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Post page loader
const loading = () => {
  return (
    <div className="p-8 flex flex-col gap-4 rounded-lg border">
      <Skeleton className="h-12" />
      <Skeleton className="h-5" />
    </div>
  );
};

export default loading;
