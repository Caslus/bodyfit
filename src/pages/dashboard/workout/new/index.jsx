import Navbar from '@/components/Navbar'
import TextInput from '@/components/TextInput'
import Toast from '@/components/Toast'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CgSpinner } from 'react-icons/cg'
import {
  FaDumbbell,
  FaExclamationTriangle,
  FaFlag,
  FaPen,
} from 'react-icons/fa'
import { Tb123 } from 'react-icons/tb'

export default function newWorkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
    },
  })

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

  const onSubmitAiWorkout = async (data) => {
    setLoading(true)
    await fetch('/api/user/workout/getAiWorkout', {
      method: 'POST',
      body: JSON.stringify({
        exercisesNumber: parseInt(data.exercisesNumber),
        workoutFocus: data.workoutFocus,
        workoutObjective: data.workoutObjective,
      }),
    })
      .then((res) => {
        res.json().then(async (workoutJson) => {
          try {
            const workout = JSON.parse(workoutJson.workout)
            await fetch(`/api/user/workout/${session.user.id}`, {
              method: 'POST',
              body: JSON.stringify({
                name: data.name,
                exercises: workout.treino.map((exercise) => {
                  return {
                    name: exercise.name,
                    sets: exercise.sets,
                    reps: '' + exercise.reps,
                  }
                }),
              }),
            }).then(() => {
              router.push('/dashboard/')
            })
          } catch (e) {
            setError('Houve um erro ao gerar o treino')
          } finally {
            setLoading(false)
          }
        })
      })
      .catch((err) => {
        setError(err.err)
        setLoading(false)
      })
  }

  return (
    <>
      <Head>
        <title>Bodyfit - Novo treino</title>
      </Head>
      <Navbar>
        <div className="card flex-shrink-0 w-[64rem] shadow-2xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold card-title">Novo treino</h1>
            <p>
              Preencha os campos a seguir para gerarmos um treino para você!
            </p>
            <form onSubmit={handleSubmit(onSubmitAiWorkout)}>
              <Controller
                control={control}
                name="name"
                render={({ field: {} }) => {
                  return (
                    <TextInput
                      label="name"
                      labelText={'Nome do treino'}
                      placeholder={'Digite o nome do treino'}
                      icon={<FaPen />}
                      register={register}
                      required
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name="exercisesNumber"
                render={({ field: {} }) => {
                  return (
                    <TextInput
                      label="exercisesNumber"
                      labelText={'Número de exercícios'}
                      placeholder={'Insira o número de exercícios (Max: 10)'}
                      icon={<Tb123 />}
                      type={'number'}
                      min={1}
                      max={10}
                      maxlength={2}
                      pattern={'\\d'}
                      register={register}
                      required
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name="workoutFocus"
                render={({ field: {} }) => {
                  return (
                    <TextInput
                      label="workoutFocus"
                      labelText={'Foco do treino'}
                      placeholder={'Digite o foco do treino (Ex: peito)'}
                      icon={<FaDumbbell />}
                      register={register}
                      required
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name="workoutObjective"
                render={({ field: {} }) => {
                  return (
                    <TextInput
                      label="workoutObjective"
                      labelText={'Objetivo do treino'}
                      placeholder={
                        'Digite o objetivo do treino (Ex: ganhar massa)'
                      }
                      icon={<FaFlag />}
                      register={register}
                      required
                    />
                  )
                }}
              />
              <div className="divider"></div>
              <div className="flex flex-col justify-center text-center">
                <div className="w-full">
                  <button
                    className="btn btn-primary w-64"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      'Gerar treino'
                    )}
                  </button>
                </div>
                <div className="divider">ou</div>
                <Link
                  href="/dashboard/workout/new/manual"
                  className="underline"
                >
                  Preencher manualmente
                </Link>
              </div>
            </form>
          </div>
        </div>
        {error && (
          <Toast
            message={error}
            icon={<FaExclamationTriangle />}
            color="alert-error"
          />
        )}
      </Navbar>
    </>
  )
}
