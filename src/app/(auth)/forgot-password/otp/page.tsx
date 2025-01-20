import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User2Icon } from 'lucide-react';
import OTPForm from '../components/OTPForm';

const ForgotPassword = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Card className='w-[90%] md:max-w-[400px]'>
        <CardHeader>
          <CardTitle>
            <div className='w-full text-center flex flex-col items-center justify-center gap-5'>
              <div className='p-3 rounded-full bg-secondary'><User2Icon size={50} /></div>
              <h1 className='font-bold'>Verifikasi OTP</h1>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <OTPForm />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword