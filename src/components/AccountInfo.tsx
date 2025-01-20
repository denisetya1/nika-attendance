import { Session } from '@auth/core/types'
import { User2 } from 'lucide-react'
import React from 'react'

const AccountInfo = ({
  session
}: {
  session: Session | null
}) => {
  return (
    <div className='flex w-auto gap-2 items-center justify-start'>
      <div className='p-2 rounded-full bg-gray-200'><User2 /></div><div>{session?.user?.name}</div>
    </div>
  )
}

export default AccountInfo