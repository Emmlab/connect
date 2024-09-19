'use client';

import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { CustomFormField, CustomButton } from './FormComponents';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  createAndEditPostSchema,
  CreateAndEditPostType,
} from '@/utils/types';
import {
  getSinglePostAction,
  updatePostAction,
} from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';


const EditPostForm = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getSinglePostAction(postId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditPostType) =>
      updatePostAction(postId, values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Something went wrong',
        });
        return;
      }
      toast({ description: 'Post updated' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      router.push('/posts');
    },
  });

  // 1. Define form.
  const form = useForm<CreateAndEditPostType>({
    resolver: zodResolver(createAndEditPostSchema),
    defaultValues: {
      message: data?.message || ''
    },
  });

  // 2. Define submit handler.
  function onSubmit(values: CreateAndEditPostType) {
    // Do something with the form values.
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='bg-muted p-8 rounded'
      >
        <h2 className='capitalize font-semibold text-4xl mb-6'>edit job</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start'>
          {/* message */}
          <CustomFormField name='message' control={form.control} />

          <CustomButton
            type='submit'
            className='self-end capitalize'
            isPending={isPending}
            text={'Edit Post'}
          />
        </div>
      </form>
    </Form>
  );
}
export default EditPostForm;
