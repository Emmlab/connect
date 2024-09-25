"use client";
import React from "react";
import { Send } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { createPostCommentAction } from "@/utils/actions/";
import {
  postCommentFormSchema,
  PostCommentFormType,
} from "@/utils/types/postLikesComments";

const CreateCommentForm = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // initialize form
  const form = useForm<PostCommentFormType>({
    resolver: zodResolver(postCommentFormSchema),
    defaultValues: {
      comment: "",
    },
  });

  // handle create post comment
  const { mutate, isPending } = useMutation({
    mutationFn: (values: PostCommentFormType) =>
      createPostCommentAction({ comment: values.comment, postId }),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      toast({ description: "Comment added successfully" });
      // update posts data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // clear form
      form.reset();
    },
  });

  // handle form submit after validation
  const onSubmit = (values: PostCommentFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className="bg-muted rounded-md w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center gap-2 w-full">
          <div className="flex-grow">
            <CustomFormField
              placeholder="Add a comment"
              hideLabel
              name="comment"
              control={form.control}
              className="w-full"
            />
          </div>
          <CustomButton
            type="submit"
            icon={<Send />}
            className="w-fit flex gap-x-2 items-center"
            isPending={isPending}
            text=""
          />
        </div>
      </form>
    </Form>
  );
};

export default CreateCommentForm;
