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
      return res.status(404).json({ error: 'Erro ao procurar mensagens' })
    }

    if (
      user.role != 'ADMIN' &&
      user.role != 'PREMIUM' &&
      user.role != 'PERSONAL'
    ) {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const messages = await prisma.message
      .findMany({
        select: {
          id: true,
          updatedAt: true,
          fromUser: {
            select: {
              id: true,
              name: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
          text: true,
        },
        where: {
          OR: [
            {
              fromUserId: token.user.user.id,
              toUserId: parseInt(req.query.chatId),
            },
            {
              fromUserId: parseInt(req.query.chatId),
              toUserId: token.user.user.id,
            },
          ],
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((messages) => {
        if (!messages) {
          return res.status(404).json({ error: 'Erro ao procurar mensagens' })
        }
        return res.status(200).json({ messages })
      })
      .catch(() => {
        return res.status(404).json({ error: 'Erro ao procurar mensagens' })
      })
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
