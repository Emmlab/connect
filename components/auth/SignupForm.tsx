"use client";
import React from "react";
import Link from "next/link";

import { Form } from "@/components/ui/form";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupFormSchema, SignupFormType } from "@/utils/types/developer";
import { developerSignupAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";

const SignupForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignupFormType) => developerSignupAction(values),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          description: data.error,
        });
        return;
      }
      toast({ description: "Signup successful" });
      // update posts data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      window.location.replace("/posts");
    },
  });

  // initialize form
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // handle form submit
  const onSubmit = (values: SignupFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted rounded-md p-8 w-[95%] md:w-[70%] lg:w-[45%] mx-auto"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">Signup</h2>
        <div className="flex flex-col gap-2">
          <CustomFormField name="name" control={form.control} />
          <CustomFormField
            inputType="email"
            name="email"
            control={form.control}
            description="Your public GITHUB email"
          />
          <CustomFormField
            inputType="password"
            name="password"
            control={form.control}
          />
          <CustomFormField
            inputType="password"
            name="confirmPassword"
            control={form.control}
          />
          <CustomButton
            type="submit"
            className="mt-5"
            isPending={isPending}
            text={"Signup"}
            size="lg"
          />
          <div className="my-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold">
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default SignupForm;
