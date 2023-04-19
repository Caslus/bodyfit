import prisma from '@/db/prisma'
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
  try {
    const { email, password } = JSON.parse(req.body).data
    if (!email || !password) {
      res.status(400).send({ message: 'Dados inválidos' })
      return
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user
        .create({
          data: {
            email,
            password: hashedPassword,
          },
        })
        .then((user) => {
          res.status(201).send(user)
        })
        .catch(() => {
          res.status(400).send({ message: 'Erro ao criar o usuário' })
        })
    }
  } catch (err) {
    res.status(400).send({ message: 'Erro ao criar o usuário' })
  }
}
