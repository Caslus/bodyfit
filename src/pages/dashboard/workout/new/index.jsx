import Navbar from '@/components/Navbar'
import TextInput from '@/components/TextInput'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPen, FaPlus, FaRedo, FaTimes } from 'react-icons/fa'

export default function newWorkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      exercises: [{ name: '', sets: '', reps: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  })

  const onSubmit = async (data) => {
    const createWorkout = await fetch(`/api/user/workout/${session.user.id}`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        exercises: data.exercises.map((exercise) => {
          return {
            name: exercise.name,
            sets: parseInt(exercise.sets),
            reps: exercise.reps,
          }
        }),
      }),
    })
    if (createWorkout) router.push('/dashboard/')
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
                      <div className="flex flew-row justify-between items-end">
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
              <div className="flex justify-end">
                <button className="btn btn-primary" type="submit">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Navbar>
    </>
  )
}
