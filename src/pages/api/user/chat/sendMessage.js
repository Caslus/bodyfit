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

    if (req.method === 'POST') {
      const message = JSON.parse(req.body)
      console.log(message)
      const newMessage = await prisma.message.create({
        data: {
          fromUserId: token.user.user.id,
          toUserId: parseInt(message.toUserId),
          text: message.text,
        },
      })
      if (!newMessage) {
        return res.status(404).json({ error: 'Erro ao enviar mensagem' })
      }
      return res.status(200).json({ message: newMessage })
    }
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
