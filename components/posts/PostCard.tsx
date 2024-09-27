import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import { ThumbsUp, ThumbsDown, MessageCircle, Trash2 } from "lucide-react";
import CreateCommentForm from "./CreateCommentForm";
import CommentList from "./CommentList";
import Avvvatars from "avvvatars-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deletePostAction, postLikeDisLikeAction } from "@/utils/actions/";
import { PostType } from "@/utils/types/";
import { format } from "date-fns";
import reaper from "@/assets/reaper.png";

const PostCard = ({ post }: { post: PostType }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = React.useState(false);

  // handle like/dislike post
  const { mutate: mutateLikeDislikePost, isPending: isPendingLikeDislikePost } =
    useMutation({
      mutationFn: (isLiking: boolean) =>
        postLikeDisLikeAction({
          post,
          isLiking,
        }),
      onSuccess: (data) => {
        if (data?.error) {
          toast({
            description: data?.error,
          });
          return;
        }
        // update posts data
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });

  // handle delete post
  const { mutate: mutateDeletePost, isPending: isPendingDeletePost } =
    useMutation({
      mutationFn: (id: string) => deletePostAction(id),
      onSuccess: (data) => {
        if (data?.error) {
          toast({
            description: data?.error,
          });
          return;
        }
        // handle update posts data
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast({ description: "Post removed" });
      },
    });

  const handleProfileRedirect = () => {
    if (post.developerName === "404") {
      toast({
        description: "User does not exist",
      });
      return true;
    }
    router.push(
      post.mine
        ? "/profile/personal-details"
        : `/profile/personal-details/?name=${post.developerName}&email=${post.developerEmail}&developerId=${post.developerId}`,
    );
  };

  return (
    <Card className="bg-muted drop-shadow-md">
      <CardHeader className="flex gap-2 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onMouseDown={() => handleProfileRedirect()}
          >
            <div className="rounded-full w-[40px] h-[40px] flex items-center justify-center shadow-lg">
              {post.developerName === "404" ? (
                <Image
                  src={reaper}
                  alt="Unkown user"
                  className="w-[38px] h-[38px] rounded-md object-contain"
                />
              ) : (
                <div
                  className={`${isPendingDeletePost || isPendingLikeDislikePost ? "animate-spin" : ""}`}
                >
                  <Avvvatars
                    style="shape"
                    value={post?.developerName || "Unknown"}
                    size={42}
                    shadow
                    border
                    borderColor="whitesmoke"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="line-clamp-1 text-base">
                {post.developerName || "Unknown"}
              </div>
              <div className="text-sm font-normal italic">
                <span className="text-xs">
                  {format(post.$createdAt, "LLL dd, y")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 my-2">
            {/* delete post */}
            {post.mine ? (
              <CustomButton
                icon={<Trash2 className="h-[18px]" />}
                text=""
                handleClick={() => mutateDeletePost(post.$id)}
                isPending={isPendingDeletePost}
                isDelete
                className="h-fit w-fit px-2 py-1"
              />
            ) : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="">{post.message}</div>
        <div className="flex items-center gap-2 mt-4">
          {/* like post button */}
          <CustomButton
            icon={
              <ThumbsUp className={`${post.liked ? "text-red-500" : ""}`} />
            }
            text={`${post.likedBy.length}`}
            handleClick={() => mutateLikeDislikePost(true)}
            isPending={isPendingLikeDislikePost}
            className="h-fit w-fit px-2 py-1 gap-1"
          />
          {/* dislike post button */}
          <CustomButton
            icon={
              <ThumbsDown
                className={`${post.disLiked ? "text-red-500" : ""}`}
              />
            }
            text={`${post.disLikedBy.length}`}
            handleClick={() => mutateLikeDislikePost(false)}
            isPending={isPendingLikeDislikePost}
            className="h-fit w-fit px-2 py-1 gap-1"
          />

          {/* toggle comments */}
          <CustomButton
            icon={<MessageCircle />}
            text={`${post?.commentCount || 0}`}
            handleClick={() => setShowComments(!showComments)}
            isPending={false}
            className="h-fit w-fit px-2 py-1 gap-1"
          />
        </div>
        {showComments ? (
          <div className="space-y-2">
            <div className="max-h-[300px] mt-2 pb-2 overflow-y-scroll">
              <CommentList postId={post.$id} />
            </div>
            <CreateCommentForm
              postId={post.$id}
              commentCount={post.commentCount}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
export default PostCard;
