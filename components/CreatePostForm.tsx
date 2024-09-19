'use client';

import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { CustomFormField, CustomButton } from './FormComponents';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  createAndEditPostSchema,
  CreateAndEditPostType,
} from '@/utils/types';
import { createPostAction } from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';


const CreateJobForm = () => {
  const form = useForm<CreateAndEditPostType>({
    resolver: zodResolver(createAndEditPostSchema),
    defaultValues: {
      message: '',
      user: userId
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditPostType) => createPostAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Something went wrong',
        });
        return;
      }
      toast({ description: 'Post created successfully' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });

      router.push('/posts');
      // form.reset();
    },
  });

  function onSubmit(values: CreateAndEditPostType) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        className='bg-muted p-8 rounded'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className='capitalize font-semibold text-4xl mb-6'>New Post</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start'>
          {/* message */}
          <CustomFormField name='message' control={form.control} />
          
          <CustomButton
            type='submit'
            className='self-end capitalize'
            isPending={isPending}
            text={'Create Post'}
          />
        </div>
      </form>
    </Form>
  );
}
export default CreateJobForm;
