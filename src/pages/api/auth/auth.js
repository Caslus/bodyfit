import prisma from '@/db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { email, password } = JSON.parse(req.body).data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(400).send({ message: 'Usuário não encontrado' })
      return
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      res.status(400).send({ message: 'Senha incorreta' })
      return
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
    res.status(200).send({ result: token })
  } catch (error) {
    res.status(400).send({ message: 'Erro ao realizar login' })
  }
}
