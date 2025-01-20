"use client";

import ButtonIndicator from '@/components/ButtonIndicator'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { verifyToken } from '@/services/user';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom';

const OTPForm = () => {
  const [state, formAction] = useFormState(verifyToken, null);
  const { toast } = useToast();
  const trxId = typeof window !== 'undefined' ? window.localStorage.getItem('trxId') : '';
  const router = useRouter()

  useEffect(() => {
    if (state?.message) {
      try {
        const data = JSON.parse(state.message);
        if (data.success) {
          window.localStorage.setItem('fptoken', data.token);
        }
        router.push('/forgot-password/reset')
      } catch (e) {
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
        <Label htmlFor="email">Kode</Label>
        <Input type="text" name="token" id="token" />
        <input type='hidden' name='trxId' value={String(trxId)} />
        <div className='text-red-500 text-sm'>{state?.errors?.token}</div>
      </div>
      <div className='p-2 mb-2 w-full text-center'>
        {/* <Button className='w-full' variant="default">Login</Button> */}
        <ButtonIndicator
          className="w-full p-6"
          type="submit"
          text="Verifikasi"
          pendingText="Memproses..."
        />
      </div>
    </form>
  )
}

export default OTPForm