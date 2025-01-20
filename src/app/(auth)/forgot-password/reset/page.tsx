import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User2Icon } from 'lucide-react';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Card className='w-[90%] md:max-w-[400px]'>
        <CardHeader>
          <CardTitle>
            <div className='w-full text-center flex flex-col items-center justify-center gap-5'>
              <h1 className='font-bold'>Reset Password</h1>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <ResetPasswordForm />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage