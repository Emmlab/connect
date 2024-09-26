"use client";
import SignupForm from "@/components/auth/SignupForm";
import BackButton from "@/components/layout/BackButton";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const SignupPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="">
        <div className="rounded-md py-4 w-[95%] md:w-[70%] lg:w-[45%] mx-auto flex justify-end">
          <BackButton />
        </div>

        <SignupForm />
      </div>
    </HydrationBoundary>
  );
};
export default SignupPage;
