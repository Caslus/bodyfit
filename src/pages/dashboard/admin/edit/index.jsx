import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'
import { useForm } from 'react-hook-form'
import TextInput from '@/components/TextInput'
import DateInput from '@/components/DateInput'
import SelectInput from '@/components/SelectInput'
import {
  FaIdBadge,
  FaRuler,
  FaUser,
  FaVenusMars,
  FaWeight,
} from 'react-icons/fa'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [userEdit, setUserEdit] = useState({})
  const userID = router.query.id
  const { register, handleSubmit } = useForm({
    values: {
      ...userEdit,
      nasc: userEdit.nasc
        ? new Date(userEdit.nasc).toISOString().slice(0, 10)
        : '',
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
    async function getUserEdit() {
      const user = await fetch(`/api/user/${userID}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUserEdit(res)
    }

    getUser()
    getUserEdit()
  }, [session])

  const onSubmit = async (data) => {
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
          router.push('/dashboard/admin/')
        }
      }
    }
    completeUser()
  }

  const handleDelete = async () => {
    async function deleteUser() {
      const user = await fetch(`/api/user/${userID}`, {
        method: 'DELETE',
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
          router.push('/dashboard/admin/')
        }
      }
    }
    deleteUser()
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
    if (user.role !== 'ADMIN') {
      router.push('/dashboard')
    } else {
      return (
        <>
          <Head>
            <title>Bodyfit - Editar usuário</title>
          </Head>
          <Navbar>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl">
              <div className="card-body">
                <h2 className="card-title">Editar usuário</h2>
                <span>Você está editando: {userEdit.email}</span>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextInput
                    register={register}
                    label={'name'}
                    icon={<FaIdBadge />}
                    labelText={'Nome'}
                    placeholder={'Digite o nome'}
                    type={'text'}
                  />
                  <DateInput
                    label={'nasc'}
                    labelText={'Data de nascimento'}
                    register={register}
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
                  <SelectInput
                    register={register}
                    icon={<FaVenusMars />}
                    label={'gender'}
                    labelText={'Sexo'}
                    pickerText={'Selecione o sexo'}
                    options={[
                      { value: 'MASCULINO', label: 'Masculino' },
                      { value: 'FEMININO', label: 'Feminino' },
                      { value: 'OUTRO', label: 'Outro' },
                    ]}
                  />
                  <SelectInput
                    register={register}
                    icon={<FaUser />}
                    label={'role'}
                    labelText={'Tipo de usuário'}
                    pickerText={'Selecione o tipo de usuário'}
                    options={[
                      { value: 'USER', label: 'Usuário' },
                      { value: 'PERSONAL', label: 'Personal' },
                      { value: 'PREMIUM', label: 'Premium' },
                      { value: 'ADMIN', label: 'Administrador' },
                    ]}
                  />

                  <div className="form-control mt-6">
                    <button className="btn btn-primary" type="submit">
                      Salvar dados
                    </button>
                  </div>
                </form>
                <div className="divider"></div>
                <div className="btn" onClick={() => handleDelete()}>
                  Deletar usuário
                </div>
              </div>
            </div>
          </Navbar>
        </>
      )
    }
  }
}
