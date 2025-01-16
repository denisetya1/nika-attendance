"use client";

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast';
import { addUser } from '@/services/user'
import { useEffect } from 'react';
import { useFormState } from 'react-dom'

const RegisterPage = () => {
  const [state, formAction] = useFormState(addUser, null);
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
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='mb-4'>
        <h1 className='font-bold'>Daftar Karyawan</h1>
      </div>

      <Card className='w-[90%] md:max-w-[400px]'>
        <div className='p-4'>
          <form action={formAction}>
            <div className='p-2 mb-2'>
              <Label htmlFor="email">Nama</Label>
              <Input type="text" name="name" id="name" />
              <div className='text-red-500 text-sm'>{state?.errors?.name}</div>
            </div>
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
            <div className='p-2 mb-2'>
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input type="password" name="confirmPassword" id="confirmPassword" />
              <div className='text-red-500 text-sm'>{state?.errors?.confirmPassword}</div>
            </div>
            <div className='p-2 mb-2 w-full text-center'>
              <Button>Daftar</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage