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

    if (user.role != 'ADMIN' && user.role != 'PREMIUM') {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const personals = await prisma.user
      .findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          role: 'PERSONAL',
        },
      })
      .catch(() => {
        return res.status(404).json({ error: 'Erro ao procurar personais' })
      })
    if (!personals) {
      return res.status(404).json({ error: 'Erro ao procurar personais' })
    }
    return res.status(200).json({ personals })
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
