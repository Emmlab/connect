"use client";
import React from 'react'
import { useSearchParams } from 'next/navigation';
import EducationList from './EducationList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProfileNavigation from '../ProfileNavigation'
import { Plus } from 'lucide-react';


const Education = () => {
  const searchParams = useSearchParams();
  // get developerId from url
  const developerId = searchParams.get('developerId') || undefined;
  
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <ProfileNavigation />
      <Card className='bg-muted w-full min-h-[70vh]'>
        <CardHeader className="flex">
          <CardTitle className="flex items-center justify-between">
            Education
            {/* component accessed in unprotected routes
            hide add education button if user has no access */}
            {!developerId ? (
              <Button
                asChild
                variant='outline'
              >
                <Link href="/profile/add-education" className='flex items-center gap-2'>
                  <Plus />
                  <span>Add Education</span>
                </Link>
              </Button>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <EducationList />
        </CardContent>
      </Card>
    </div>
  )
}

export default Education