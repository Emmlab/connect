'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavbarAvatar from './NavbarAvatar';
import LogoutButton from '@/components/auth/LogoutButton'
import ThemeToggle from '@/components/layout/ThemeToggle';

// navbar items on large devices
const NavbarLinks = ({ protectedRoute }: { protectedRoute: boolean}) => {
  const pathname = usePathname();

  return (
    <div className='gap-x-2 hidden lg:flex items-center'>
      {protectedRoute ? (
        <>
        <Button
          asChild
          variant={pathname === "/posts" ? 'outline' : 'link'}
        >
          <Link href="/posts" className='flex items-center gap-2'>
            <House />
            <span>Posts</span>
          </Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/developers" ? 'outline' : 'link'}
        >
          <Link href="/developers" className='flex items-center gap-2'>
            <UsersRound />
            <span>Developers</span>
          </Link>
        </Button>
        </>
      ) : null}
      <ThemeToggle />
      {protectedRoute ? (
        <DropdownMenu>
        <DropdownMenuTrigger asChild className=''>
          <Button variant='outline' size='icon' className="w-[45px] h-[45px] rounded-full shadow-md">
            <NavbarAvatar />
            <span className='sr-only'>Profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-fit'
          align='end'
        >
          <DropdownMenuItem>
            <Button
              asChild
              size="sm"
              variant={pathname === "/profile/personal-details" ? 'outline' : 'link'}
            >
              <Link href="/profile/personal-details" className='flex items-center w-full'>
                Profile
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      ) : null}
    </div>
  );
}

export default NavbarLinks;
