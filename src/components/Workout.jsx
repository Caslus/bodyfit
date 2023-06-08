import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
export default function Workout({ workout, session }) {
  const router = useRouter()
  const [logs, setLogs] = useState([])

  const getDays = () => {
    let days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    let day = new Date().getDay()
    for (let i = 0; i < day + 1; i++) {
      days.push(days.shift())
    }

    for (let i = 0; i < 7; i++) {
      days[i] = {
        day: days[i],
        date: new Date(new Date().setDate(new Date().getDate() + i - 6)),
      }
    }
    return days
  }
  const [days, setDays] = useState(getDays())

  useEffect(() => {
    if (!session) return
    async function getLogs() {
      const user = await fetch(`/api/user/workout/log/${workout.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setLogs(res.logs)
    }
    getLogs()
  }, [session, days])

  const setLog = async (data) => {
    if (data.check) {
      const log = await fetch(`/api/user/workout/log/${workout.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const res = await log.json()
    } else {
      const log = await fetch(`/api/user/workout/log/${workout.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const res = await log.json()
    }

    setDays(getDays())
  }

  return (
    <div className="card w-[40rem] m-2 shadow-xl">
      <div className="card-body flex flex-col justify-between">
        <div className="w-full">
          <div className="card-title m-2">
            <h2>{workout.name}</h2>
          </div>
          <table className="table table-compact table-zebra w-full">
            <thead>
              <tr>
                <th>Exercício</th>
                <th>Séries</th>
                <th>Repetições</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise, index) => {
                return (
                  <tr key={index}>
                    <td>{exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.reps}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between items-end">
          <button
            className="btn btn-primary w-32"
            onClick={() => {
              router.push({
                pathname: '/dashboard/workout/edit',
                query: { workoutId: workout.id },
              })
            }}
          >
            Editar
          </button>
          <div className="flex flex-row gap-6">
            {days.map((day, index) => {
              return (
                <div key={index} className="flex flex-col items-center">
                  <h3>{day.day}</h3>
                  {logs.find(
                    (log) =>
                      log.date.slice(0, 10) ==
                      day.date.toISOString().slice(0, 10)
                  ) ? (
                    <button
                      className="w-8 h-8 text-green-300"
                      onClick={() => {
                        setLog({ check: false, date: day.date })
                      }}
                    >
                      <HiCheckCircle className="w-8 h-8" />
                    </button>
                  ) : (
                    <button
                      className="w-8 h-8 text-primary"
                      onClick={() => {
                        setLog({
                          check: true,
                          date: day.date,
                          workoutId: workout.id,
                        })
                      }}
                    >
                      <HiXCircle className="w-8 h-8" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
