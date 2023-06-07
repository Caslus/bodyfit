import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaUserCircle } from 'react-icons/fa'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [personals, setPersonals] = useState({})

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    async function getPersonals() {
      const users = await fetch(`/api/user/getPersonals`)
      const res = await users.json()
      if (res) setPersonals(res)
    }

    getUser()
    getPersonals()
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
    return (
      <>
        <Head>
          <title>Bodyfit - Procurar personal</title>
        </Head>
        <Navbar>
          <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4">
            <h1 className="text-4xl font-bold">Personais disponíveis</h1>
            <div className="grid grid-cols-2">
              {personals?.personals &&
                personals.personals.map((personal) => {
                  return (
                    <div className="card flex-shrink-0 w-full shadow-2xl p-4 gap-2 items-center">
                      <FaUserCircle className="text-6xl" />
                      <h1 className="text-2xl">{personal.name}</h1>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          router.push({
                            pathname: `/dashboard/chat/`,
                            query: { id: personal.id },
                          })
                        }}
                      >
                        Entrar em contato
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
        </Navbar>
      </>
    )
  }
}
