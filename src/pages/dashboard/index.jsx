import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-5xl">
        <CgSpinner className="animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/')
  }

  if (session)
    return (
      <>
        <Head>
          <title>Bodyfit - Página inicial</title>
        </Head>
        <Navbar />
      </>
    )
}
