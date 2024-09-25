import React from "react";
import { useSearchParams } from "next/navigation";
import WorkExperienceList from "./WorkExperienceList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileNavigation from "../ProfileNavigation";
import { Plus } from "lucide-react";

const WorkExperience = () => {
  const searchParams = useSearchParams();
  // get developerId from url
  const developerId = searchParams.get("developerId") || undefined;

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <ProfileNavigation />
      <Card className="bg-muted w-full min-h-[70vh]">
        <CardHeader className="flex">
          <CardTitle className="flex items-center justify-between">
            Work Experience
            {/* component accessed in unprotected routes
            hide button if user has no access */}
            {!developerId ? (
              <Button asChild variant="outline">
                <Link
                  href="/profile/add-work-experience"
                  className="flex items-center gap-2"
                >
                  <Plus />
                  <span>Add Work Experience</span>
                </Link>
              </Button>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <WorkExperienceList />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkExperience;
