import { useRouter } from 'next/router'

export default function Workout({ workout }) {
  const router = useRouter()

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
        <div className="flex flex-row justify-between">
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
        </div>
      </div>
    </div>
  )
}
