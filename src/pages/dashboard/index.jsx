import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    getUser()
  }, [session])

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

  if (user && session && user.id) {
    if (
      !user?.name ||
      !user?.nasc ||
      !user?.weight ||
      !user?.height ||
      !user?.gender
    ) {
      router.push('/dashboard/complete')
    } else {
      return (
        <>
          <Head>
            <title>Bodyfit - Página inicial</title>
          </Head>
          <Navbar>
            <p>{user.email}</p>
          </Navbar>
        </>
      )
    }
  }
}
