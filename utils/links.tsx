import { CircleFadingPlus, Sparkles, CircleUserRound } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const links: NavLink[] = [
  {
    href: '/add-post',
    label: 'add post',
    icon: <CircleFadingPlus />,
  },
  {
    href: '/posts',
    label: 'all posts',
    icon: <Sparkles />,
  },
  {
    href: '/profile',
    label: 'profile',
    icon: <CircleUserRound />,
  },
];

export default links;
