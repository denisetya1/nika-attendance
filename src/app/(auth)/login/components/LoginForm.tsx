"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/services/user';
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom';

const LoginForm = () => {
  const [state, formAction] = useFormState(loginUser, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Error!",
        description: state?.message,
      });
    }
  }, [state?.message])

  return (
    <form action={formAction}>
      <div className='p-2 mb-2'>
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" />
        <div className='text-red-500 text-sm'>{state?.errors?.email}</div>
      </div>
      <div className='p-2 mb-2'>
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" id="password" />
        <div className='text-red-500 text-sm'>{state?.errors?.password}</div>
      </div>
      <div className='p-2 mb-2 w-full text-center'>
        <Button>Login</Button>
      </div>
    </form>
  )
}

export default LoginForm