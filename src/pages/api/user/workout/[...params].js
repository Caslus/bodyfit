import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

export default async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    const requester = await prisma.user.findUnique({
      where: {
        id: token.user.user.id,
      },
      select: {
        role: true,
      },
    })
    if (!requester) {
      return res.status(404).json({ error: 'Erro ao executar ação' })
    }
    const userId = parseInt(req.query?.params[0])
    if (token.user.user.id != userId && requester.role != 'ADMIN') {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    if (req.method == 'GET') {
      const workoutId = parseInt(req.query?.params[1])
      if (isNaN(workoutId) && !isNaN(userId)) {
        const workouts = await prisma.workout.findMany({
          where: {
            userId: userId,
          },
          select: {
            id: true,
            name: true,
            exercises: true,
          },
        })
        return res.status(200).json({ workouts: workouts })
      }
      if (!isNaN(workoutId)) {
        const workout = await prisma.workout.findUnique({
          where: {
            id: workoutId,
          },
          select: {
            id: true,
            name: true,
            exercises: true,
          },
        })
        if (workout) {
          return res.status(200).json({ workout: workout })
        }
      }
      return res.status(404).json({ error: 'Treino não encontrado' })
    }
    if (req.method == 'POST') {
      const data = JSON.parse(req.body)
      const workout = await prisma.workout
        .create({
          data: {
            name: data.name,
            user: {
              connect: {
                id: userId,
              },
            },
            exercises: {
              createMany: {
                data: data.exercises,
              },
            },
          },
        })
        .catch(() => {
          return res.status(404).json({ error: 'Erro ao criar treino' })
        })
      if (workout) {
        return res.status(200).json({ workout: workout })
      }
      return res.status(404).json({ error: 'Erro ao criar treino' })
    }
    if (req.method == 'PUT') {
    }
    if (req.method == 'DELETE') {
      const workoutId = parseInt(req.query?.params[0])
      const workout = await prisma.workout
        .findUnique({
          where: {
            id: workoutId,
          },
          select: {
            userId: true,
          },
        })
        .catch(() => {
          return res.status(404).json({ error: 'Erro ao deletar treino' })
        })
      if (workout.userId != userId && requester.role != 'ADMIN') {
        return res.status(401).json({ error: 'Não autorizado' })
      }
      const deleteExercises = await prisma.exercise
        .deleteMany({
          where: {
            workoutId: workoutId,
          },
        })
        .catch(() => {
          return res.status(404).json({ error: 'Erro ao deletar treino' })
        })
      if (!deleteExercises) {
        return res.status(404).json({ error: 'Erro ao deletar treino' })
      }
      const deleteWorkout = await prisma.workout
        .delete({
          where: {
            id: workoutId,
          },
        })
        .catch((e) => {
          return res.status(404).json({ error: 'Erro ao deletar treino' })
        })

      if (deleteWorkout) {
        return res.status(200).json({ message: 'Treino deletado' })
      }
      return res.status(404).json({ error: 'Erro ao deletar treino' })
    }

    return res.status(401).json({ error: 'Não autorizado' })
  }
}