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
    if (token.user.user.id != req.query.userId && requester.role != 'ADMIN') {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    if (req.method == 'GET') {
      const user = await prisma.user
        .findUnique({
          where: {
            id: parseInt(req.query.userId),
          },
        })
        .catch(() => {
          return res.status(404).json({ error: 'Erro ao encontrar usuário' })
        })
      if (!user) {
        return res.status(404).json({ error: 'Erro ao encontrar usuário' })
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        nasc: user.nasc,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        workouts: user.workouts,
      })
    } else if (req.method == 'PUT') {
      const data = JSON.parse(req.body)
      if (
        (data.role == 'ADMIN' || data.role == 'PREMIUM') &&
        requester.role != 'ADMIN'
      ) {
        return res.status(401).json({ error: 'Não autorizado' })
      }
      const user = await prisma.user
        .update({
          where: {
            id: parseInt(req.query.userId),
          },
          data: {
            name: data.name,
            nasc: new Date(data.nasc),
            weight: parseFloat(data.weight),
            height: parseFloat(data.height),
            gender: data.gender,
            role: data.role,
          },
        })
        .catch((e) => {
          return res.status(404).json({ error: 'Erro ao editar o usuário' })
        })
      return res.status(200).json({
        user,
      })
    } else if (req.method == 'DELETE') {
      const user = await prisma.user
        .delete({
          where: {
            id: parseInt(req.query.userId),
          },
        })
        .catch((e) => {
          return res.status(404).json({ error: 'Erro ao deletar o usuário' })
        })
      return res.status(200).json({
        user,
      })
    }
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
