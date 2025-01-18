import { Button } from '@/components/ui/button'
import React from 'react'
import LogoutButton from './components/LogoutButton'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 w-screen h-screen flex relative'>
      <div className='header absolute top-0 left-0 w-full p-6 border-b-[1px] border-s-slate-500 bg-white
        flex items-end justify-end
      '>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}

export default AuthLayout