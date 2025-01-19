import { auth } from "@/auth";
import { redirect } from 'next/navigation'

const Home = async () => {
  const session = await auth();
  console.log('aaaa', session, session?.role)

  if (session?.user) {
    console.log('masuk sini')
    if (session?.role === 'admin') {
      console.log('lalu sini')
      redirect('/report/attendance')
    } else {
      console.log('atau sini')
      redirect('/attendance')
    }
  } else {
    redirect('/login')
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      loading...
    </div>
  );
}

export default Home
