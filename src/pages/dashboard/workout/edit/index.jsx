import Navbar from '@/components/Navbar'
import TextInput from '@/components/TextInput'
import Toast from '@/components/Toast'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  FaExclamationTriangle,
  FaMinus,
  FaPen,
  FaPlus,
  FaRedo,
  FaTimes,
} from 'react-icons/fa'

export default function newWorkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState(null)
  const workoutId = router.query.workoutId
  const [workout, setWorkout] = useState({})
  const { register, reset, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      exercises: [{ name: '', sets: '', reps: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
    defaultValues: workout?.exercises,
  })

  useEffect(() => {
    if (!session) return
    async function getWorkout() {
      const user = await fetch(
        `/api/user/workout/${session.user.id}/${workoutId}`,
        {
          method: 'GET',
        }
      ).then(async (res) => {
        res = await res.json()
        let workout = res.workout
        setWorkout(workout)
        reset(
          { name: workout.name, exercises: workout.exercises },
          { keepTouched: true }
        )
      })
    }

    getWorkout()
  }, [session])

  const onSubmit = async (data) => {
    if (data.exercises.length === 0) {
      setError('Você precisa adicionar pelo menos um exercício.')
      return
    }
    const editWorkout = await fetch(`/api/user/workout/${session.user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: workoutId,
        name: data.name,
        exercises: data.exercises.map((exercise) => {
          return {
            name: exercise.name,
            sets: parseInt(exercise.sets),
            reps: exercise.reps,
          }
        }),
      }),
    }).then(() => {
      router.push('/dashboard/')
    })
  }

  const handleDelete = async () => {
    const deleteWorkout = await fetch(`/api/user/workout/${workoutId}`, {
      method: 'DELETE',
    })
    if (deleteWorkout) router.push('/dashboard/')
  }

  return (
    <>
      <Head>
        <title>Bodyfit - Editar treino</title>
      </Head>
      <Navbar>
        <div className="card flex-shrink-0 w-[64rem] shadow-2xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold card-title">Editar treino</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-96">
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
              </div>
              <div className="divider"></div>
              <div className="flex flex-col gap-2 items-end">
                <div className="w-full">
                  <h2 className="font-bold text-xl">Exercícios</h2>
                  {fields.map((item, index) => {
                    return (
                      <div
                        className="flex flew-row justify-between items-end"
                        key={index}
                      >
                        <div>
                          <Controller
                            control={control}
                            name={`exercises[${index}].name`}
                            render={({ field }) => {
                              return (
                                <TextInput
                                  label={`exercises[${index}].name`}
                                  labelText={'Nome do exercício'}
                                  placeholder={'Digite o nome do exercício'}
                                  icon={<FaPen />}
                                  register={register}
                                  required
                                />
                              )
                            }}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name={`exercises[${index}].sets`}
                            render={({ field }) => {
                              return (
                                <TextInput
                                  label={`exercises[${index}].sets`}
                                  labelText={'Número de séries'}
                                  placeholder={'Quantas séries?'}
                                  type={'number'}
                                  icon={<FaTimes />}
                                  pattern={'^\\d*$'}
                                  register={register}
                                  required
                                />
                              )
                            }}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name={`exercises[${index}].reps`}
                            render={({ field }) => {
                              return (
                                <TextInput
                                  label={`exercises[${index}].reps`}
                                  labelText={'Número de repetições'}
                                  placeholder={'Quantas repetições?'}
                                  icon={<FaRedo />}
                                  register={register}
                                  required
                                />
                              )
                            }}
                          />
                        </div>

                        <button
                          className="btn"
                          type="submit"
                          onClick={() => {
                            remove(index)
                          }}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => append({ name: '', sets: '', reps: '' })}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <button
                  className="btn"
                  onClick={() => {
                    handleDelete()
                  }}
                >
                  Deletar
                </button>
                <button className="btn btn-primary" type="submit">
                  Salvar
                </button>
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
