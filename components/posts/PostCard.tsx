import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import { ThumbsUp, ThumbsDown, MessageCircle, Trash2 } from "lucide-react";
import CreateCommentForm from "./CreateCommentForm";
import CommentList from "./CommentList";
import Avvvatars from "avvvatars-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  deletePostAction,
  postLikeAction,
  postDisLikeAction,
} from "@/utils/actions/";
import { PostCommentType, PostType } from "@/utils/types/";
import { format } from "date-fns";
import reaper from "@/assets/reaper.png";

const PostCard = ({ post }: { post: PostType }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = React.useState(false);

  // handle like post
  const { mutate: mutateLikePost, isPending: isPendingLikePost } = useMutation({
    mutationFn: (id: string) =>
      postLikeAction({
        postId: id,
        isLiked: post.liked,
        isDisLiked: post.disLiked,
        likesCount: post.likesCount,
        disLikesCount: post.disLikesCount,
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

  // handle dis like post
  const { mutate: mutateDisLikePost, isPending: isPendingDisLikePost } =
    useMutation({
      mutationFn: (id: string) =>
        postDisLikeAction({
          postId: id,
          isLiked: post.liked,
          isDisLiked: post.disLiked,
          likesCount: post.likesCount,
          disLikesCount: post.disLikesCount,
        }),
      onSuccess: (data) => {
        if (data?.error) {
          toast({
            description: data.error,
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
      <CardHeader className="flex gap-2">
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
                  className={`${isPendingDeletePost || isPendingLikePost || isPendingDisLikePost ? "animate-spin" : ""}`}
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
                {post.developerName || "Anonymous"}
              </div>
              <div className="text-sm font-normal">
                Posted on{" "}
                <i className="text-xs">
                  {format(post.$createdAt, "LLL dd, y")}
                </i>
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
        <div className="flex items-center gap-2 my-2">
          {/* like post button */}
          {!isPendingDisLikePost ? (
            <CustomButton
              icon={
                <ThumbsUp className={`${post.liked ? "text-red-500" : ""}`} />
              }
              text={`${post.likesCount}`}
              handleClick={() => mutateLikePost(post.$id)}
              isPending={isPendingLikePost}
              className="h-fit w-fit px-2 py-1 gap-1"
            />
          ) : null}
          {/* dislike post button */}
          {!isPendingLikePost ? (
            <CustomButton
              icon={
                <ThumbsDown
                  className={`${post.disLiked ? "text-red-500" : ""}`}
                />
              }
              text={`${post.disLikesCount}`}
              handleClick={() => mutateDisLikePost(post.$id)}
              isPending={isPendingDisLikePost}
              className="h-fit w-fit px-2 py-1 gap-1"
            />
          ) : null}

          {/* toggle comments */}
          <CustomButton
            icon={<MessageCircle />}
            text={`${post?.comments?.length ?? 0}`}
            handleClick={() => setShowComments(!showComments)}
            isPending={false}
            className="h-fit w-fit px-2 py-1 gap-1"
          />
        </div>
        {showComments ? (
          <div className="max-h-[300px] mt-4 overflow-y-scroll">
            <CommentList comments={post.comments as PostCommentType[]} />
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <CreateCommentForm postId={post.$id} />
      </CardFooter>
    </Card>
  );
};
export default PostCard;
