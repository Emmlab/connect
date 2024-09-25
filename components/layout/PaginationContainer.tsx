'use client';
import React from "react";
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


type PaginationContainerProps = {
  currentPage: number;
  totalPages: number;
};
const PaginationContainer = ({ currentPage, totalPages }: PaginationContainerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* create array of page numbers based on the `totalPages` value. It uses
  the `Array.from()` method to create a new array with a length equal to `totalPages`. The second
  argument of `Array.from()` is a mapping function that generates the values for each element in the
  array. In this case, it generates an array of numbers starting from 1 up to `totalPages`. */
  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    // set default params; consider params on profile pages
    const defaultParams = {
      page: String(page),
      developerId: searchParams.get('developerId') || undefined,
      name: searchParams.get('name') || undefined,
      email: searchParams.get('email') || undefined,
    };
    const params = new URLSearchParams(JSON.parse(JSON.stringify(defaultParams)));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex  gap-x-2'>
      {pageButtons.map((page) => {
        return (
          <Button
            key={page}
            className="h-fit w-fit px-2 py-1 gap-1"
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
}

export default PaginationContainer;
