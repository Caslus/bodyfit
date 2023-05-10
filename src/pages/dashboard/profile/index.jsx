import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'
import { FaPen } from 'react-icons/fa'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})

  const subscribe = async () => {
    const res = await fetch(`/api/user/subscribe/${user.id}`, {
      method: 'PUT',
    })
    const session = await res.json()
    if (session.error) {
      setError(session.error)
      return
    }
    window.location.reload()
  }

  const Premium = () => {
    if (user.role == 'PERSONAL' || user.role == 'ADMIN') return
    return (
      <>
        <div className="divider"></div>
        <h2 className="text-3xl">Assinatura</h2>

        <p className="text-xl">
          Tipo de usuário:{' '}
          {user.role == 'PREMIUM' ? <b>premium</b> : <b>base</b>}
        </p>
        {/* assinar ou cancelar assinatura */}
        {user.role == 'PREMIUM' ? (
          <button
            className="btn btn-error"
            onClick={() => {
              subscribe()
            }}
          >
            Cancelar assinatura
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => {
              subscribe()
            }}
          >
            Assinar premium
          </button>
        )}
      </>
    )
  }

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
    return (
      <>
        <Head>
          <title>Bodyfit - Perfil</title>
        </Head>
        <Navbar>
          <div className="flex flex-col">
            <div className="card flex-shrink-0 w-full shadow-2xl p-4 gap-2">
              <div className="flex justify-between">
                <h1 className="text-3xl">Seu perfil</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    router.push('/dashboard/profile/edit')
                  }}
                >
                  <FaPen />
                </button>
              </div>
              <div className="flex flex-col">
                <p className="text-xl">Nome: {user.name}</p>
                <p className="text-xl">Email: {user.email}</p>
                <p className="text-xl">
                  Data de nascimento:{' '}
                  {new Date(user.nasc).toISOString().slice(0, 10)}
                </p>
                <p className="text-xl">Altura: {user.height}cm</p>
                <p className="text-xl">Peso: {user.weight}kg</p>
              </div>
              <Premium user={user.role} />
            </div>
          </div>
        </Navbar>
      </>
    )
  }
}
