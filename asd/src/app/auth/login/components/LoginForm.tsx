'use client'


import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormValues = {
  username: string,
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      router.replace('/')
    }
  }, [session])

  useEffect(() => {
    if (error === true) {
      setTimeout(() => {
        setError(false)
      }, 10000)
    }
  }, [error])

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const SubmitLogin: SubmitHandler<FormValues> = async (formData: FormValues) => {
    const { username, password } = formData

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: '/'
    })

    if (result?.ok === true) {
      router.replace('/')
    } else {
      setError(true)
    }
  }

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(SubmitLogin)}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Input placeholder="Username" {...register('username')} required />
          </div>
          <div className="mb-2">
            <Input placeholder="Password" type="password" {...register('password')} required />
          </div>
          <div className="mb-2">
            <Button type="submit" className="w-full">Masuk</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default LoginForm