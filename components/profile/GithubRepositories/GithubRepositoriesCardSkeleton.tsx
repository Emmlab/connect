import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';

// github repositories loader
const GithubRepositoriesCardSkeleton = () => {
  return (
    <div className='p-4 flex flex-col gap-3 rounded-lg border border-slate-400'>
      <Skeleton className='h-8 bg-slate-400' />
      <Skeleton className='h-8 bg-slate-400 md:ml-[40px]' />
    </div>
  )
}

export default GithubRepositoriesCardSkeleton