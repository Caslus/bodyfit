import Navbar from '@/components/Navbar'
import TextInput from '@/components/TextInput'
import Toast from '@/components/Toast'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  FaDumbbell,
  FaExclamationTriangle,
  FaFlag,
  FaMinus,
  FaPen,
  FaPlus,
  FaRedo,
  FaTimes,
} from 'react-icons/fa'
import { Tb123 } from 'react-icons/tb'

export default function newWorkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState(null)
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const onSubmitAiWorkout = async (data) => {
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
        })
      })
      .catch((err) => {
        setError(err.err)
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
                  <button className="btn btn-primary w-64" type="submit">
                    Gerar treino
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
