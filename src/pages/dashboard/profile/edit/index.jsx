import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'
import { useForm } from 'react-hook-form'
import TextInput from '@/components/TextInput'
import {
  FaExclamationTriangle,
  FaIdBadge,
  FaRuler,
  FaWeight,
} from 'react-icons/fa'
import Toast from '@/components/Toast'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [error, setError] = useState(null)
  const userID = session.user.id
  const { register, handleSubmit } = useForm({
    values: {
      ...user,
      nasc: user.nasc ? new Date(user.nasc).toISOString().slice(0, 10) : '',
    },
  })

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

  function setErrorMsg(error) {
    setError(error)
    const timeout = setTimeout(() => {
      setError(null)
    }, 2500)
    return () => clearTimeout(timeout)
  }

  const onSubmit = async (data) => {
    if (data.name.length < 3 || data.name.length > 50) {
      return setErrorMsg('Nome inválido')
    }
    if (data.weight < 20 || data.weight > 500) {
      return setErrorMsg('Peso inválido')
    }
    if (data.height < 100 || data.height > 300) {
      return setErrorMsg('Altura inválida')
    }
    async function completeUser() {
      const user = await fetch(`/api/user/${userID}`, {
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          nasc: data.nasc,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
        }),
        method: 'PUT',
      })
      const res = await user.json()
      if (res) {
        if (res?.error) {
          setError(data.error)
          const timeout = setTimeout(() => {
            setError(null)
          }, 2500)
          return () => clearTimeout(timeout)
        } else {
          router.push('/dashboard/profile/')
        }
      }
    }
    completeUser()
  }

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
          <title>Bodyfit - Editar perfil</title>
        </Head>
        <Navbar>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl">
            <div className="card-body">
              <h2 className="card-title">Editar perfil</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  register={register}
                  label={'name'}
                  icon={<FaIdBadge />}
                  labelText={'Nome'}
                  placeholder={'Digite o nome'}
                  type={'text'}
                />
                <TextInput
                  register={register}
                  label={'weight'}
                  icon={<FaWeight />}
                  labelText={'Peso (kg)'}
                  placeholder={'Digite o peso (Ex: 73.5)'}
                  type={'number'}
                  step={'0.1'}
                  pattern={'^[0-9]*$'}
                />
                <TextInput
                  register={register}
                  label={'height'}
                  icon={<FaRuler />}
                  labelText={'Altura (m)'}
                  placeholder={'Digite a altura (Ex: 1.85)'}
                  type={'number'}
                  step={'0.01'}
                  pattern={'^[0-9]*$'}
                />

                <div className="form-control mt-6">
                  <button className="btn btn-primary" type="submit">
                    Salvar dados
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Navbar>
        {error && (
          <Toast
            message={error}
            icon={<FaExclamationTriangle />}
            color="alert-error"
          />
        )}
      </>
    )
  }
}
