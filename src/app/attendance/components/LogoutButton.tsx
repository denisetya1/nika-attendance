"use client"
// import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

const LogoutButton = () => {

  return (
    <Button
      onClick={() => signOut()}
    >
      Logout
    </Button>
  )
}

export default LogoutButton