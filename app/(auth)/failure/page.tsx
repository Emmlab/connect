import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import FailureImg from '@/assets/undraw_failure.svg';

/**
 * The FailurePage component renders a message and a button for handling failed Github OAuth
 * @returns A FailurePage component is being returned. It displays an illustration for failure, a
 * message indicating Github Authentication failure, contact information for the admin, and a button to
 * go back to safety.
 */
const FailurePage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh]">
      <Image src={FailureImg} alt='Failure Illustration' className="pb-4 h-[150px]" />
      <div className="flex flex-col items-center gap-2">
        <div className="font-bold">Github Authentication Failed.</div>
        <div className="text-sm">Something went wrong. Please reach out to <a href="mailto:beja.emmanuel@gmail.com" className="font-semibold">Emmanuel(Admin)</a></div>
      </div>
      <div>
        <Button
          asChild
          className="mt-4"
          variant='outline'>
          <Link href="/" className='flex items-center gap-2'>
            <ShieldCheck />
            <span>Back to safety</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default FailurePage