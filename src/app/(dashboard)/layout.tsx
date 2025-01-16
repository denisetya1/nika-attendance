import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 w-screen h-screen flex'>
      {children}
    </div>
  )
}

export default DashboardLayout