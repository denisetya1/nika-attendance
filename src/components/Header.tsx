import React from 'react'
import AccountInfo from './AccountInfo'
import LogoutButton from '@/app/attendance/components/LogoutButton'
import { auth } from '@/auth'

const Header = async () => {
  const session = await auth()

  return (
    <div className='header fixed top-0 left-0 w-full p-6 border-b-[1px] border-s-slate-500 bg-white
        flex items-center justify-between md:justify-end md:gap-3
      '>
      <AccountInfo session={session} />
      <LogoutButton />
    </div>
  )
}

export default Header