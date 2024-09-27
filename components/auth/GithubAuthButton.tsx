import React from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import CustomButton from "@/components/layout/FormComponents/CustomButton";
import { toast } from "@/hooks/use-toast";
import {
  developerGithubLoginAction,
  developerGithubLoginCallbackAction,
} from "@/utils/actions/";
import { Github } from "lucide-react";

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
        if (!result?.error) {
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
    onSuccess: (data) => {
      if (data?.error || !data?.data) {
        toast({
          description: data.error,
        });
        return;
      }
      window.location.replace(data.data);
    },
  });

  return (
    <div className="">
      <CustomButton
        icon={<Github />}
        text="Github (Recommended)"
        className="mt-4 w-full"
        size="lg"
        handleClick={() => mutateDeveloperGithubLogin()}
        isPending={isPendingDeveloperGithubLogin}
      />
    </div>
  );
};

export default GithubAuthButton;
