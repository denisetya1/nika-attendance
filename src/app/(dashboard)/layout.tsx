import React from 'react'
import LogoutButton from '../attendance/components/LogoutButton'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 w-screen h-screen flex relative'>
      <div className='header absolute top-0 left-0 w-full p-3 border-b-[1px] border-s-slate-500 bg-white
        flex items-end justify-end
      '>
        <LogoutButton />
      </div>
      <div className='pt-[60px] w-full'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout