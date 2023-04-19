import { createUser } from './controllers/user'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    createUser(req, res)
  }
}
