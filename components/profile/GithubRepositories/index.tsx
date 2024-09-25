"use client";
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProfileNavigation from '../ProfileNavigation'
import GithubRepositoriesList from './GithubRepositoriesList'
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getDeveloper } from '@/utils/actions/developer';
import { Plus } from 'lucide-react';


const GithubRepositories = () => {
  const searchParams = useSearchParams();

  // get developer
  const { data: developer } = useQuery({
    queryKey: ['developer', 1],
    queryFn: () => getDeveloper()
  });
  // use email from params if there
  // email on params allows public access
  const developerEmail = searchParams.get('email') || developer?.email
  // get developerId from url
  const developerId = searchParams.get('developerId') || undefined;

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <ProfileNavigation />
      <Card className='bg-muted w-full min-h-[70vh]'>
        <CardHeader className="flex">
          <CardTitle className="flex items-center justify-between">
            Github Repositories
            {/* component accessed in unprotected routes
            hide add education button if user has no access */}
            {!developerId ? (
              <Button
                asChild
                variant='outline'
              >
                <Link href="https://github.com/new" className='flex items-center gap-2'>
                  <Plus />
                  <span>Add Repository</span>
                </Link>
              </Button>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          {developerEmail ? <GithubRepositoriesList developerEmail={developerEmail} /> : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default GithubRepositories