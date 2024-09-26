"use client";
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import BackButton from "@/components/layout/BackButton";

const LoginPage = () => {
  return (
    <div className="">
      <div className="rounded-md py-4 w-[95%] md:w-[70%] lg:w-[45%] mx-auto flex justify-end">
        <BackButton />
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
