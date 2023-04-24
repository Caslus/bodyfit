import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'
import Workout from '@/components/Workout'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    async function getWorkouts() {
      const user = await fetch(`/api/user/workout/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setWorkouts(res.workouts)
    }
    getUser()
    getWorkouts()
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
            {workouts && workouts.length > 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4">
                <h1 className="text-4xl font-bold">Seus treinos</h1>
                <div className="grid grid-cols-2">
                  {workouts.map((workout, index) => {
                    return <Workout workout={workout} key={index} />
                  })}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/dashboard/workout/new')}
                >
                  Criar treino
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-bold">
                  Está meio vazio por aqui...
                </h1>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/dashboard/workout/new')}
                >
                  Criar treino
                </button>
              </div>
            )}
          </Navbar>
        </>
      )
    }
  }
}
