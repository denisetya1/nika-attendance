import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './components/LoginForm';
import Link from 'next/link';
import { User2Icon } from 'lucide-react';

const LoginPage = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Card className='w-[90%] md:max-w-[400px]'>
        <CardHeader>
          <CardTitle>
            <div className='w-full text-center flex flex-col items-center justify-center gap-5'>
              <div className='p-3 rounded-full bg-secondary'><User2Icon size={50} /></div>
              <h1 className='font-bold'>Login Rekan Absensi BeautyCat</h1>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <LoginForm />
          </div>
          <div className='flex flex-col items-center justify-center gap-5'>
            <div className='text-sm text-gray-500 mt-3'>atau</div>
            <div>
              <Link className="text-primary" href='/register'>Daftar</Link> jika belum mempunyai akun.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage