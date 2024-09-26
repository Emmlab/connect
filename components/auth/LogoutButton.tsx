"use client";
import React from "react";

import CustomButton from "../layout/FormComponents/CustomButton";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { developerLogoutAction } from "@/utils/actions/";

const LogoutButton = () => {
  const queryClient = new QueryClient();

  // handle developer logout
  const {
    mutate: mutateDeveloperLogoutAction,
    isPending: isPendingDeveloperLogoutAction,
  } = useMutation({
    mutationFn: () => developerLogoutAction(),
    onSuccess: () => {
      queryClient.clear();
      window.location.replace("/");
    },
  });

  return (
    <CustomButton
      text="Logout"
      className="w-full"
      handleClick={() => mutateDeveloperLogoutAction()}
      isPending={isPendingDeveloperLogoutAction}
    />
  );
};

export default LogoutButton;
