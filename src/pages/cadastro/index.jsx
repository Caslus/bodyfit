import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import TextInput from '@/components/TextInput'
import Toast from '@/components/Toast'
import { FaAt, FaKey, FaRedo, FaExclamationTriangle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export default function Cadastro() {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState(null)

  const router = useRouter()

  const onSubmit = (data) => {
    if (data.password != data.passwordConfirm) {
      setError('As senhas não coincidem')
      const timeout = setTimeout(() => {
        setError(null)
      }, 2500)
      return () => clearTimeout(timeout)
    }
    const register = async () => {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })
      return response.json()
    }
    register().then(async (data) => {
      if (data?.error) {
        setError(data.error)
        const timeout = setTimeout(() => {
          setError(null)
        }, 2500)
        return () => clearTimeout(timeout)
      }
      router.push({
        pathname: '/',
        query: { msg: 'Cadastro realizado com sucesso' },
      })
    })
  }

  return (
    <>
      <Head>
        <title>Bodyfit - Cadastro</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="flex flex-col items-center justify-center">
              <Image src="/logo.png" alt="Bodyfit" width={300} height={300} />
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
              <TextInput
                register={register}
                label={'passwordConfirm'}
                icon={<FaRedo />}
                labelText={'Confirmar senha'}
                placeholder={'Repita sua senha'}
                type="password"
                required
              />

              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Cadastrar
                </button>
              </div>
            </form>

            <label className="label">
              <Link href="/" className="label-text-alt link link-hover">
                Já possui uma conta?
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
