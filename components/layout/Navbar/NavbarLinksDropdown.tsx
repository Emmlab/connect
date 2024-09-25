import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/auth/LogoutButton'
import { AlignLeft, House, UsersRound, CircleUserRound } from 'lucide-react';

// navbar items on small devices
const NavbarLinksDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='lg:hidden'>
        <Button variant='outline' size='icon'>
          <AlignLeft />
          <span className='sr-only'>Toggle links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-52 lg:hidden'
        align='start'
        sideOffset={25}
      >
        <DropdownMenuItem>
          <Link href="/posts" className='flex items-center gap-x-2 ml-3'>
            <House />
            <span>Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/developers" className='flex items-center gap-x-2 ml-3'>
            <UsersRound />
            <span>Developers</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/profile/personal-details" className='flex items-center gap-x-2 ml-3'>
            <CircleUserRound />  <span className='capitalize'>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem><LogoutButton /></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarLinksDropdown;
