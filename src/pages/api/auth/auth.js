import prisma from '@/db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (credentials) => {
  try {
    const { email, password } = credentials
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !password) {
      return
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return
    }
    const token = jwt.sign({ id: user.id }, process.env.NEXTAUTH_SECRET, {
      expiresIn: '1d',
    })
    return {
      result: token,
      user: { id: user.id, email: user.email, name: user.name },
    }
  } catch (error) {
    return
  }
}

export const register = async (credentials) => {
  try {
    const { email, password } = credentials
    if (!email || !password) {
      return
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user
        .create({
          data: {
            email,
            password: hashedPassword,
          },
        })
        .catch(() => {
          return
        })
      return user
    }
  } catch (err) {
    return
  }
}
