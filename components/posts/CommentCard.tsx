import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Avvvatars from "avvvatars-react";
import CustomButton from "@/components/layout/FormComponents/CustomButton";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCommentType } from "@/utils/types/postLikesComments";
import { deletePostCommentAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import reaper from "@/assets/reaper.png";
import { useRouter } from "next/navigation";

const CommentCard = ({ comment }: { comment: PostCommentType }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  // handle delete comment
  const {
    mutate: mutateDeletePostComment,
    isPending: isPendingDeletePostComment,
  } = useMutation({
    mutationFn: (id: string) => deletePostCommentAction({ id }),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          description: data?.error,
        });
        return;
      }
      // update post data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ description: "Post Comment removed" });
    },
  });

  const handleProfileRedirect = () => {
    if (comment.developerName === "404") {
      toast({
        description: "User does not exist",
      });
      return true;
    }
    router.push(
      comment.mine
        ? "/profile/personal-details"
        : `/profile/personal-details/?name=${comment.developerName}&email=${comment.developerEmail}&developerId=${comment.developerId}`,
    );
  };

  return (
    <Card className="border border-slate-500 shadow-md bg-muted">
      <CardHeader className="flex gap-2 py-2">
        <CardTitle className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onMouseDown={() => handleProfileRedirect()}
          >
            <div className="rounded-full w-[40px] h-[40px] shadow-lg flex items-center justify-center">
              {comment.developerName === "404" ? (
                <Image
                  src={reaper}
                  alt="Unkown user"
                  className="w-[38px] h-[38px] rounded-md object-contain"
                />
              ) : (
                <Avvvatars
                  style="shape"
                  value={comment?.developerName || "Unknown"}
                  size={38}
                  shadow
                  border
                  borderColor="whitesmoke"
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="line-clamp-1 text-base">
                {comment.developerName}
              </div>
              <div className="text-xs italic">
                {format(comment.$createdAt, "LLL dd, y")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 my-2">
            {comment.mine ? (
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
            ) : null}
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
