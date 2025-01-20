import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { User2Icon } from 'lucide-react';
import ForgotPassword from './components/ForgotPassword';

const LoginPage = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Card className='w-[90%] md:max-w-[400px]'>
        <CardHeader>
          <CardTitle>
            <div className='w-full text-center flex flex-col items-center justify-center gap-5'>
              <div className='p-3 rounded-full bg-secondary'><User2Icon size={50} /></div>
              <h1 className='font-bold'>Lupa Pasword?</h1>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <ForgotPassword />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage