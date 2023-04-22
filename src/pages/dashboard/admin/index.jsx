import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import Navbar from '@/components/Navbar'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [users, setUsers] = useState({})

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }

    async function getUsers() {
      const users = await fetch(`/api/user/getUsers`)
      const res = await users.json()
      if (res) setUsers(res)
    }

    getUser()
    getUsers()
  }, [session])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-5xl">
        <CgSpinner className="animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/')
  }

  if (user && session && user.id) {
    if (user.role !== 'ADMIN') {
      router.push('/dashboard')
    } else {
      return (
        <>
          <Head>
            <title>Bodyfit - Painel de Administração</title>
          </Head>
          <Navbar>
            <div className="flex flex-col">
              <div className="card flex-shrink-0 w-full shadow-2xl p-4 gap-2">
                <h1 className="text-2xl">Painel de Administração</h1>
                <h2 className="text-xl">Lista de usuários</h2>
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>E-mail</th>
                      <th>Nome</th>
                      <th>Tipo de usuário</th>
                      <th>Data de nascimento</th>
                      <th>Peso</th>
                      <th>Altura</th>
                      <th>Sexo</th>
                      <th>Editar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.users &&
                      users.users.map((user) => {
                        return (
                          <tr>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.name || '(NÃO DEFINIDO)'}</td>
                            <td>{user.role || '(NÃO DEFINIDO)'}</td>
                            <td>
                              {new Date(user.nasc).toISOString().slice(0, 10)}
                            </td>
                            <td>{user.weight || '(NÃO DEFINIDO)'}</td>
                            <td>{user.height || '(NÃO DEFINIDO)'}</td>
                            <td>{user.gender || '(NÃO DEFINIDO)'}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  router.push({
                                    pathname: '/dashboard/admin/edit',
                                    query: { id: user.id },
                                  })
                                }}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </Navbar>
        </>
      )
    }
  }
}
