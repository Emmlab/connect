import SignupForm from "@/components/auth/SignupForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const SignupPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SignupForm />
    </HydrationBoundary>
  );
};
export default SignupPage;
