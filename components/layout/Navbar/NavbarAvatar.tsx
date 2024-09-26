import React from "react";
import Avvvatars from "avvvatars-react";
import { useQuery } from "@tanstack/react-query";
import { getDeveloper } from "@/utils/actions/developer";
import { usePathname } from "next/navigation";

const NavbarAvatar = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  // get developer
  const { data: developer } = useQuery({
    queryKey: ["developer", 1],
    queryFn: () => getDeveloper(),
  });

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [pathname]);

  return (
    <div className={`${isLoading ? "animate-spin" : ""}`}>
      <Avvvatars
        style="shape"
        value={developer?.name || "Github Username"}
        size={42}
        shadow
        border
        borderColor="whitesmoke"
      />
    </div>
  );
};

export default NavbarAvatar;
