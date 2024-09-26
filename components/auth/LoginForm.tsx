import React from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";
import CustomButton from "@/components/layout/FormComponents/CustomButton";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormType } from "@/utils/types/developer";
import { developerLoginAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: LoginFormType) => developerLoginAction(values),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          description: data.error,
        });
        return;
      }
      toast({ description: "Login successful" });
      window.location.replace("/posts");
    },
  });

  // initialize form
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // handle form submit
  const onSubmit = (values: LoginFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded w-[95%] md:w-[70%] lg:w-[45%] mx-auto"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">Login</h2>
        <div className="flex flex-col gap-2">
          <CustomFormField
            inputType="email"
            name="email"
            control={form.control}
          />
          <CustomFormField
            inputType="password"
            name="password"
            control={form.control}
          />
          <CustomButton
            type="submit"
            className="mt-5"
            isPending={isPending}
            text={"Login"}
            size="lg"
          />
          <div className="my-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold">
              Signup
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
