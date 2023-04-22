import Link from 'next/link'
import Image from 'next/image'
import {
  FaBars,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Navbar({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    getUser()
  }, [session])

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-1 px-2 mx-2">
            <Link href="/dashboard">
              <Image src="/logo.svg" alt="Bodyfit" width={100} height={100} />
            </Link>
          </div>
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <FaBars />
            </label>
          </div>
        </div>
        <div className="flex justify-center items-center flex-grow">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 justify-between">
          <div>
            <div className="p-4">
              <p>Olá{user?.name ? `, ${user.name}` : ''}!</p>
            </div>
            <div className="divider"></div>
            <li>
              <a>
                <FaUser />
                Perfil
              </a>
            </li>
            <li>
              <a>
                <FaCog />
                Configurações
              </a>
            </li>
            {user?.role == 'ADMIN' && (
              <li>
                <a onClick={() => router.push('/dashboard/admin')}>
                  <FaShieldAlt />
                  Painel de administrador
                </a>
              </li>
            )}
          </div>
          <div>
            <div className="divider"></div>
            <li>
              <a onClick={() => signOut({ callbackUrl: '/' })}>
                <FaSignOutAlt /> Sair
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  )
}
