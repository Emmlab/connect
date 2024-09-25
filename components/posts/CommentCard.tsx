import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Avvvatars from "avvvatars-react";
import CustomButton from "@/components/layout/FormComponents/CustomButton";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCommentType } from "@/utils/types/postLikesComments";
import { deletePostCommentAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CommentCard = ({ comment }: { comment: PostCommentType }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // handle delete comment
  const {
    mutate: mutateDeletePostComment,
    isPending: isPendingDeletePostComment,
  } = useMutation({
    mutationFn: (id: string) => deletePostCommentAction({ id }),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      // update post data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ description: "Post Comment removed" });
    },
  });

  return (
    <Card className="border border-slate-500 shadow-md bg-muted">
      <CardHeader className="flex gap-2 py-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-[40px] h-[40px] shadow-lg flex items-center justify-center">
              <Avvvatars
                style="shape"
                value={comment?.developerName || "Github Username"}
                size={38}
                shadow
                border
                borderColor="whitesmoke"
              />
            </div>
            <div className="flex flex-col">
              <div className="line-clamp-1 text-base">
                {comment.developerName || "Unknown"}
              </div>
              <div className="text-xs italic">
                {format(comment.$createdAt, "LLL dd, y")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 my-2">
            <CustomButton
              icon={<Trash2 className="h-[18px]" />}
              text=""
              className="h-fit w-fit px-2 py-1"
              handleClick={() =>
                comment && mutateDeletePostComment(comment.$id as string)
              }
              isPending={isPendingDeletePostComment}
              isDelete
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="md:pl-[48px]">{comment.comment}</div>
      </CardContent>
    </Card>
  );
};
export default CommentCard;
