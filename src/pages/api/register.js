import { register } from './auth/auth'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const credentials = JSON.parse(req.body).data
    const user = await register(credentials)
    if (user) {
      return res.status(200).json({ result: user })
    }
  }
  return res.status(400).json({ error: 'Houve um erro ao realizar o cadastro' })
}
