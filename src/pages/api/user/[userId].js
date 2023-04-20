import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

export default async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    if (token.user.user.id != req.query.userId) {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const user = await prisma.user
      .findUnique({
        where: {
          id: parseInt(req.query.userId),
        },
      })
      .catch(() => {
        return res.status(404).json({ error: 'Erro ao encontrar usuário' })
      })
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      nasc: user.nasc,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
    })
  }

  return res.status(401).json({ error: 'Não autorizado' })
}
