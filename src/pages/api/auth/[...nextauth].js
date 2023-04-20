import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login } from './auth'

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      async authorize(credentials) {
        try {
          const data = await login(credentials)
          return { token: data.result, user: data.user }
        } catch (error) {
          throw new Error(error.message)
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user) return user
      return null
    },
    async session({ session, token }) {
      if (token.user.user) {
        session.user = token.user.user
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
