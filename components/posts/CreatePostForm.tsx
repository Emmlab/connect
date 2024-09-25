"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";
import { CircleFadingPlus } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postFormSchema, PostFormType } from "@/utils/types/posts";
import { createPostAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";

const CreatePostForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // initialize form
  const form = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // handle create post
  const { mutate, isPending } = useMutation({
    mutationFn: (values: PostFormType) => createPostAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      toast({ description: "Post created successfully" });
      // update posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // clear form
      form.reset();
    },
  });

  // handle form submit
  const onSubmit = (values: PostFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className="bg-muted p-5 mb-4 rounded-md drop-shadow-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2 h-fit">
          <div className="">
            <CustomFormField
              inputType="textarea"
              placeholder="What do you want to talk about?"
              hideLabel
              name="message"
              control={form.control}
            />
          </div>
          <div className="flex items-center justify-between">
            <CustomButton
              type="submit"
              icon={<CircleFadingPlus />}
              className="w-fit flex gap-x-2 items-center"
              isPending={isPending}
              text={"Post"}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
export default CreatePostForm;
