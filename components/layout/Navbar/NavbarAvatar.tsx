import React from 'react';
import Avvvatars from 'avvvatars-react';
import { useQuery } from '@tanstack/react-query';
import { getDeveloper } from '@/utils/actions/developer'


const NavbarAvatar = () => {
  // get developer
  const { data: developer } = useQuery({
    queryKey: ['developer', 1],
    queryFn: () => getDeveloper(),
  });

  return (
    <Avvvatars
      style="shape"
      value={developer?.name || 'Github Username'}
      size={42}
      shadow
      border
      borderColor="whitesmoke"
      />
  )
}

export default NavbarAvatar