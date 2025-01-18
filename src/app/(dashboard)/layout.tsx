import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 w-screen h-screen flex relative'>
      <div className='header absolute top-0 left-0 w-full h-[40px] border-b-[1px] border-s-slate-500'>
        sdsds
      </div>
      {children}
    </div>
  )
}

export default DashboardLayout