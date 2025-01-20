import React from 'react'
import Header from '@/components/Header'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 w-screen h-screen flex relative'>
      <Header />
      <div className='w-full mt-[80px]'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout