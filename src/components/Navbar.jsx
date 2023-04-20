import Link from 'next/link'
import Image from 'next/image'
import { FaBars } from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="Bodyfit" width={100} height={100} />
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div>
          <p>Olá{session.user?.name ? `, ${session.user.name}` : ''}!</p>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Perfil</a>
            </li>
            <li>
              <a>Configurações</a>
            </li>
            <li>
              <a onClick={() => signOut({ callbackUrl: '/' })}>Sair</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
