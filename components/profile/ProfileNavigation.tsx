"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { User, BriefcaseBusiness, GraduationCap, Github } from "lucide-react";
import { usePathname } from "next/navigation";

const ProfileNavigation = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // get developerId from url
  const developerId = searchParams.get("developerId") || "";
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  // show different urls when developerId is defined/no
  const links = [
    {
      icon: <User />,
      name: "Personal Details",
      routePrivate: "/profile/personal-details",
      routePublic: `/profile/personal-details/?name=${name}&email=${email}&developerId=${developerId}`,
    },
    {
      icon: <BriefcaseBusiness />,
      name: "Work Experience",
      routePrivate: "/profile/work-experience",
      routePublic: `/profile/work-experience/?name=${name}&email=${email}&developerId=${developerId}`,
    },
    {
      icon: <GraduationCap />,
      name: "Education",
      routePrivate: "/profile/education",
      routePublic: `/profile/education/?name=${name}&email=${email}&developerId=${developerId}`,
    },
    {
      icon: <Github />,
      name: "Github Repositories",
      routePrivate: "/profile/github-repositories",
      routePublic: `/profile/github-repositories/?name=${name}&email=${email}&developerId=${developerId}`,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row md:flex-col items-start overflow-x-scroll md:overflow-x-auto">
        {links.map((link) => (
          <Button
            asChild
            variant={
              pathname === (developerId ? link.routePublic : link.routePrivate)
                ? "outline"
                : "link"
            }
            key={`${link.routePrivate}`}
          >
            <Link
              href={developerId ? link.routePublic : link.routePrivate}
              className="flex items-center gap-2"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProfileNavigation;
