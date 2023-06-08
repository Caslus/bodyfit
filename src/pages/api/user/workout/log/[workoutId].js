import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

export default async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    const user = await prisma.user.findUnique({
      where: {
        id: token.user.user.id,
      },
      select: {
        role: true,
      },
    })
    if (!user) {
      return res
        .status(404)
        .json({ error: 'Erro ao definir acompanhamento do treino' })
    }

    if (req.method === 'GET') {
      const workoutId = req.query?.workoutId
      if (!workoutId) {
        return res
          .status(404)
          .json({ error: 'Erro ao buscar acompanhamento do treino' })
      }
      const logs = await prisma.workoutLog.findMany({
        where: {
          workoutId: parseInt(workoutId),
        },
        select: {
          id: true,
          date: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: 7,
      })
      if (!logs) {
        return res
          .status(404)
          .json({ error: 'Erro ao buscar acompanhamento do treino' })
      }
      return res.status(200).json({ logs: logs })
    }

    if (req.method === 'POST') {
      const workoutId = req.query?.workoutId
      if (!workoutId) {
        return res
          .status(404)
          .json({ error: 'Erro ao buscar acompanhamento do treino' })
      }
      const data = JSON.parse(req.body)
      if (data.check == true) {
        const newLog = await prisma.workoutLog.create({
          data: {
            workoutId: parseInt(workoutId),
            date: data.date,
          },
        })
        if (!newLog) {
          return res
            .status(404)
            .json({ error: 'Erro ao definir acompanhamento do treino' })
        }
        return res.status(200).json({ log: newLog })
      }

      const date = data.date
      const deletedLogs = await prisma.workoutLog.deleteMany({
        where: {
          workoutId: parseInt(workoutId),
          date: {
            gte: new Date(date.slice(0, 10)),
            lte: new Date(date.slice(0, 10) + 'T23:59:59.999Z'),
          },
        },
      })
      if (!deletedLogs) {
        return res
          .status(404)
          .json({ error: 'Erro ao definir acompanhamento do treino' })
      }
      return res.status(200).json({ logs: deletedLogs })
    }
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
