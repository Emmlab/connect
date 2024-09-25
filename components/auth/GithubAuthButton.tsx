import React from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Github } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import {
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
} from "@/utils/actions/";

const GithubAuthButton = () => {
  // get params on github OAuth callback;
  // if params then user got redirected from github
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  let callbackParams = {};
  if (userId && secret) {
    callbackParams = { userId, secret };
  }

  // call callback function if userId
  // save use param values to create appwrite session for auth
  useQuery({
    queryKey: ["developer", userId],
    queryFn: () =>
      developerGithubLoginCallbackAction(callbackParams).then((result) => {
        console.log({result});
        if (result?.$id) {
          window.location.replace("/posts");
        }
        return result;
      }),
    enabled: !!userId,
  });

  // Initiate github OAuth and redirect to link provided by github
  const {
    mutate: mutateDeveloperGithubLogin,
    isPending: isPendingDeveloperGithubLogin,
  } = useMutation({
    mutationFn: () => developerGithubLoginAction(),
    onSuccess: (link) => {
      if (!link) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      window.location.replace(link);
    },
  });

  return (
    <div className="">
      <CustomButton
        icon={<Github />}
        text="Get Started"
        className="mt-4"
        size="lg"
        handleClick={() => mutateDeveloperGithubLogin()}
        isPending={isPendingDeveloperGithubLogin}
      />
    </div>
  );
};

export default GithubAuthButton;
