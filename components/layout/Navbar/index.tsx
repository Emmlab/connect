"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavbarLinksDropdown from "./NavbarLinksDropdown";
import NavbarLinks from "./NavbarLinks";
import { getAuthenticatedDeveloper } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const pathname = usePathname();
  // get developer data
  const { data: developerData } = useQuery({
    queryKey: ["developer", 1],
    queryFn: () => getAuthenticatedDeveloper(),
  });

  const protectedRoutes = ["/posts", "/developers"];
  const sessionProtectedRoutes = [
    "/profile/personal-details",
    "/profile/work-experience",
    "/profile/education",
    "/profile/github-repositories",
  ];
  // if developer/session exists add sessionProtectedRoutes need to be protectedRoutes
  if (developerData && developerData?.$id) {
    protectedRoutes.push(...sessionProtectedRoutes);
  }
  const isProtected = protectedRoutes.includes(pathname);

  return (
    <nav className="bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        {/* small devices nav items */}
        {isProtected ? <NavbarLinksDropdown /> : null}
        {/* logo */}
        <Link href="/" className="text-xl font-bold">
          GitConnect
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        {/* right side nav items */}
        <NavbarLinks protectedRoute={isProtected} />
      </div>
    </nav>
  );
};
export default Navbar;
