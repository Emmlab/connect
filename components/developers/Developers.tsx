"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import DeveloperCard from "./DeveloperCard";
import DeveloperCardSkeleton from "./DeveloperCardSkeleton";
import NothingtoShow from "../layout/NothingtoShow";
import BackButton from "../layout/BackButton";

import { getDevelopersAction } from "@/utils/actions/";
import { DeveloperType } from "@/utils/types/developer";

const Developers = () => {
  const pathname = usePathname();

  // get all developers
  const { data, isPending } = useQuery({
    queryKey: ["developers", pathname],
    queryFn: () => getDevelopersAction(),
  });

  return (
    <div className="space-y-4 w-full">
      {/* hide back button on other pages eg. landing page */}
      {pathname === "/developers" ? <BackButton /> : null}
      <div className="bg-muted rounded-md px-4 pb-5 h-full">
        <div className="flex items-center w-full py-3">
          <h2 className="font-bold pt-4 pb-2">Developers</h2>
        </div>
        <div className="flex flex-col gap-2 h-[80] md:h-[70vh] overflow-y-scroll">
          {isPending ? (
            <>
              <DeveloperCardSkeleton />
              <DeveloperCardSkeleton />
              <DeveloperCardSkeleton />
            </>
          ) : (
            <>
              {data?.users ? (
                data.users.map((developer: DeveloperType) => (
                  <React.Fragment key={`${developer.$id}-developer`}>
                    <DeveloperCard developer={developer} />
                  </React.Fragment>
                ))
              ) : (
                <NothingtoShow />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Developers;
