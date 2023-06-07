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
      return res.status(404).json({ error: 'Erro ao procurar chats' })
    }

    if (
      user.role != 'ADMIN' &&
      user.role != 'PREMIUM' &&
      user.role != 'PERSONAL'
    ) {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    let chats = []
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
            },
            {
              toUserId: token.user.user.id,
            },
          ],
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((messages) => {
        messages.forEach((message) => {
          let otherUser
          if (message.fromUser.id == token.user.user.id) {
            otherUser = message.toUser
          } else {
            otherUser = message.fromUser
          }
          const chat = chats.find((chat) => chat.id == otherUser.id)
          if (chat) {
            if (chat.updatedAt < message.updatedAt) {
              chat.updatedAt = message.updatedAt
              chat.lastMessage = message.text
            }
          } else {
            chats.push({
              id: otherUser.id,
              name: otherUser.name,
              updatedAt: message.updatedAt,
              lastMessage: message.text,
            })
          }
        })
        return res.status(200).json({ chats })
      })
      .catch(() => {
        return res.status(404).json({ error: 'Erro ao procurar chats' })
      })
    if (!chats) {
      return res.status(404).json({ error: 'Erro ao procurar chats' })
    }
    return res.status(200).json({ chats })
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
