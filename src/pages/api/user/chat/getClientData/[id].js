import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

const findUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      nasc: true,
      weight: true,
      height: true,
      gender: true,
      workouts: {
        select: {
          id: true,
          name: true,
          exercises: {
            select: {
              id: true,
              name: true,
              sets: true,
              reps: true,
            },
          },
          workoutLogs: {
            select: {
              id: true,
              date: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
      },
    },
  })
  return user
}

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
      return res.status(404).json({ error: 'Erro ao buscar dados do cliente' })
    }

    if (user.role != 'ADMIN' && user.role != 'PERSONAL') {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const userId = parseInt(req.query.id)
    try {
      const client = await findUser(userId)
      return res.status(200).json(client)
    } catch {
      return res.status(500).json({ error: 'Erro ao buscar dados do cliente' })
    }
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
