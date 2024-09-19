import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomButton } from './FormComponents';
import { Heart, MessageCircle, CalendarClock, Pencil, Trash2 } from 'lucide-react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostAction } from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';
import { PostType } from '@/utils/types';


const PostCard = ({ post }: { post: PostType }) => {
  const date = new Date(post.createdAt).toLocaleDateString();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: mutateDeletePost, isPending: isPendingDeletePost } = useMutation({
    mutationFn: (id: string) => deletePostAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Something went wrong',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });

      toast({ description: 'Post removed' });
    },
  });
  
  return (
    <Card className='bg-muted'>
      <CardHeader>
        <CardTitle>{post.developer.name}</CardTitle>
        <CardDescription><div className=''><CalendarClock /> {date}</div></CardDescription>
      </CardHeader>
      <CardContent className='mt-4'>
        <div className='flex mb-2'>{post.message}</div>
        <div className='grid grid-cols-2 gap-4'>
          <CustomButton
           icon={<Heart />}
           text={`${post.likes} likes`}
           handleClick={() => {}}
           isPending={false} />
          <CustomButton
           icon={<MessageCircle />}
           text={`${post.comments} comments`}
           handleClick={() => {}}
           isPending={false} />
          <CustomButton
            icon={<Pencil />}
            text=""
            handleClick={() => router.push(`/posts/${post.id}`)}
            isPending={false}
          />
          <CustomButton
            icon={<Trash2 />}
            text=""
            handleClick={() => mutateDeletePost(post.id)}
            isPending={isPendingDeletePost}
          />
        </div>
      </CardContent>
      <CardFooter className='flex gap-4'>
        {/* TODO: comments here */}
      </CardFooter>
    </Card>
  );
}
export default PostCard;
