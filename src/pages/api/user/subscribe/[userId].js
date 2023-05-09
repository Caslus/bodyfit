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

    if (req.method == 'PUT') {
      let newRole = requester.role == 'USER' ? 'PREMIUM' : 'USER'
      const user = await prisma.user
        .update({
          where: {
            id: parseInt(req.query.userId),
          },
          data: {
            role: newRole,
          },
        })
        .catch((e) => {
          return res.status(404).json({ error: 'Erro ao editar o usuário' })
        })
      return res.status(200).json({
        user,
      })
    }
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
