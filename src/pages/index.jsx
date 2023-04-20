import Image from 'next/image'
import TextInput from '@/components/textInput'
import { FaAt, FaKey } from 'react-icons/fa'
import Head from 'next/head'
import Link from 'next/link'

import { useForm } from 'react-hook-form'

export default function Home() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    const register = async () => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })
      return response.json()
    }
    register().then((data) => {
      console.log(data)
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
      </main>
    </>
  )
}
