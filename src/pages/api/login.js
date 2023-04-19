import { login } from './auth/auth'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    login(req, res)
  }
}
