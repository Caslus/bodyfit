import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

export default async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    if (token.user.user.id != req.query.userId) {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    const data = JSON.parse(req.body)
    const user = await prisma.user
      .update({
        where: {
          id: parseInt(req.query.userId),
        },
        data: {
          name: data.name,
          role: data.role,
          nasc: new Date(data.nasc),
          weight: parseFloat(data.weight),
          height: parseFloat(data.height),
          gender: data.gender,
        },
      })
      .catch((e) => {
        return res.status(404).json({ error: 'Erro ao completar o usuário' })
      })
    return res.status(200).json({
      user,
    })
  } else {
    return res.status(401).json({ error: 'Não autorizado' })
  }
}
