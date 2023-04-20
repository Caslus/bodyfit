import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import TextInput from '@/components/textInput'
import Toast from '@/components/Toast'
import { FaAt, FaExclamationTriangle, FaKey } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Home() {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === 'authenticated') router.push('/dashboard/')

  const onSubmit = async (data) => {
    const response = await signIn('login', {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((data) => {
      if (data.error) {
        switch (data.error) {
          case 'CredentialsSignin':
            setError('Credenciais inválidas')
            break
          default:
            setError('Erro ao realizar login')
        }
        const timeout = setTimeout(() => {
          setError(null)
        }, 2500)
        return () => clearTimeout(timeout)
      }
      router.push('/dashboard/')
    })
  }

  return (
    <>
      <Head>
        <title>Bodyfit - Login</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="flex flex-col items-center justify-center">
              <Image src="/logo.svg" alt="Bodyfit" width={300} height={300} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                register={register}
                label={'email'}
                icon={<FaAt />}
                labelText={'Email'}
                placeholder={'Digite seu email'}
                type={'email'}
                required
              />

              <TextInput
                register={register}
                label={'password'}
                icon={<FaKey />}
                labelText={'Senha'}
                placeholder={'Digite sua senha'}
                type="password"
                required
              />
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
              </div>
            </form>

            <label className="label">
              <Link
                href="/cadastro/"
                className="label-text-alt link link-hover"
              >
                Não possui uma conta?
              </Link>
            </label>
          </div>
        </div>
        {error && (
          <Toast
            message={error}
            icon={<FaExclamationTriangle />}
            color="alert-error"
          />
        )}
      </main>
    </>
  )
}
