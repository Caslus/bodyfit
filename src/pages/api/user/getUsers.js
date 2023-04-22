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
      return res.status(404).json({ error: 'Erro ao procurar usuários' })
    }

    if (user.role != 'ADMIN') {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const users = await prisma.user
      .findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          nasc: true,
          weight: true,
          height: true,
          gender: true,
        },
      })
      .catch(() => {
        return res.status(404).json({ error: 'Erro ao procurar usuários' })
      })
    if (!users) {
      return res.status(404).json({ error: 'Erro ao procurar usuários' })
    }
    return res.status(200).json({ users })
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
