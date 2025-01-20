"use client";

import ButtonIndicator from '@/components/ButtonIndicator'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from '@/services/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useFormState } from 'react-dom';

const ResetPasswordForm = () => {
  const [state, formAction] = useFormState(resetPassword, null);
  const { toast } = useToast();
  const router = useRouter()
  const trxId = typeof window !== 'undefined' ? window.localStorage.getItem('trxId') : '';
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('fptoken') : '';

  useEffect(() => {
    if (state?.message) {
      try {
        const data = JSON.parse(state.message);

        if (data.success) {
          window.localStorage.removeItem('fptoken');
          window.localStorage.removeItem('trxId');
        }

        router.replace('/login')

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
      <input type="hidden" name='trxId' value={String(trxId)} />
      <input type="hidden" name='token' value={String(token)} />
      <div className='p-2 mb-2'>
        <Label htmlFor="password">Password Baru</Label>
        <Input type="password" name="password" id="password" />
        <div className='text-red-500 text-sm'>{state?.errors?.password}</div>
      </div>
      <div className='p-2 mb-2'>
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <Input type="password" name="confirmPassword" id="confirmPassword" />
        <div className='text-red-500 text-sm'>{state?.errors?.confirmPassword}</div>
      </div>
      <div className='p-2 mb-2 w-full text-center'>
        {/* <Button className='w-full' variant="default">Login</Button> */}
        <ButtonIndicator
          className="w-full p-6"
          type="submit"
          text="Simpan"
          pendingText="Memproses..."
        />
      </div>
    </form>
  )
}

export default ResetPasswordForm