import React from "react"
import { useRouter } from "next/navigation";
import Avvvatars from 'avvvatars-react';
import { DeveloperType } from '@/utils/types/developer';


/**
 * The `DeveloperCard` component generates a clickable card displaying a developer's name and avatar,
 * with a link to their profile page including their details in the URL parameters.
 * @param  - The `DeveloperCard` component takes in a prop called `developer` which is of type
 * `DeveloperType`. The `DeveloperType` likely has properties such as `name`, `email`, and `developer`
 * (renamed to `developerId` for better readability).
 * @returns The `DeveloperCard` component is returning a JSX element that represents a card displaying
 * developer information. The card includes the developer's name and a clickable area that, when
 * clicked, redirects the user to a profile URL with the developer's email, name, and ID included as
 * URL parameters. The card also includes an avatar component displaying the developer's name or a
 * default value if the name is not provided.
 */
const DeveloperCard = ({ developer: { name, email, $id: developerId }}: { developer: DeveloperType }) => {
  const router = useRouter()

  // add user details in url params before redirection
  const defaultParams = {
    email: email,
    name: name,
    developerId: developerId,
  };
  const params = new URLSearchParams(JSON.parse(JSON.stringify(defaultParams)));
  const profileUrl = `/profile/personal-details/?${params.toString()}`;

  return (
    <div
      className="flex items-center gap-2 rounded-md py-4 px-2 border border-slate-400 cursor-pointer"
      onMouseDown={() => router.push(profileUrl)}>
      <div className="rounded-full w-[45px] h-[45px]">
        <Avvvatars
          style="shape"
          value={name || 'Github Username'}
          size={42}
          shadow
          border
          borderColor="whitesmoke"
        />
      </div>
      <div className="line-clamp-1">{name}</div>
    </div>
  )
}

export default DeveloperCard