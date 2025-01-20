"use client";
import ButtonIndicator from '@/components/ButtonIndicator'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { forgotPassword } from '@/services/user';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom';

const ForgotPasswordForm = () => {
  const [state, formAction] = useFormState(forgotPassword, null);
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    if (state?.message) {
      try {
        const data = JSON.parse(state.message);
        if (data.success) {
          window.localStorage.setItem('trxId', data.trxId);
        }
        router.push('/forgot-password/otp')
      } catch (e) {
        console.log(e);
        toast({
          title: "Error!",
          description: state?.message,
        })
      }
    }
  }, [state?.message, toast])

  return (
    <form action={formAction}>
      <div className='p-2 mb-2'>
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" placeholder='Input Email' />
        <div className='text-red-500 text-sm'>{state?.errors?.email}</div>
      </div>
      <div className='p-2 mb-2 w-full text-center'>
        {/* <Button className='w-full' variant="default">Login</Button> */}
        <ButtonIndicator
          className="w-full p-6"
          type="submit"
          text="Login"
          pendingText="Memproses..."
        />
      </div>
    </form>
  )
}

export default ForgotPasswordForm