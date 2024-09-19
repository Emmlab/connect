'use client';

import { useSearchParams } from 'next/navigation';
import { getAllPostsAction } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';

import PaginationContainer from './PaginationContainer';
import PostCard from './PostCard';

const Posts = () => {
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get('page')) || 1;

  const { data, isPending } = useQuery({
    queryKey: ['posts', pageNumber],
    queryFn: () => getAllPostsAction({ page: pageNumber }),
  });
  const posts = data?.posts || [];
  const count = data?.count || 0;
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  if (isPending) return <h2 className='text-xl'>Please Wait...</h2>;

  if (posts.length < 1) return <h2 className='text-xl'>No Posts Found...</h2>;

  return (
    <>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-xl font-semibold capitalize '>
          {count} posts found
        </h2>
        {totalPages < 2 ? null : (
          <PaginationContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      <div className='grid md:grid-cols-2  gap-8'>
        {posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    </>
  );
}
export default Posts;
