import { Card } from '@/components/ui/card';
import LoginForm from './components/LoginForm';

const LoginPage = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='mb-4'>
        <h1 className='font-bold'>Login</h1>
      </div>

      <Card className='w-[90%] md:max-w-[400px]'>
        <div className='p-4'>
          <LoginForm />
        </div>
      </Card>
    </div>
  )
}

export default LoginPage