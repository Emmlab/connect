import React from 'react'
import { CircleAlert } from 'lucide-react';

const NothingtoShow = () => {
  return <div className="flex flex-col justify-center rounded-md border mt-4 pt-12 pb-12">
      <div className='flex gap-x-2 items-center justify-center my-2'>
        <CircleAlert /> <span className='capitalize'>Nothing to show.</span>
      </div>
  </div>
}

export default NothingtoShow