import Link from 'next/link'
import Image from 'next/image'
import { FaBars, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <div class="drawer drawer-end">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <div class="w-full navbar bg-base-300">
          <div class="flex-1 px-2 mx-2">
            <Link href="/dashboard">
              <Image src="/logo.svg" alt="Bodyfit" width={100} height={100} />
            </Link>
          </div>
          <div class="flex-none">
            <label for="my-drawer-3" class="btn btn-square btn-ghost">
              <FaBars />
            </label>
          </div>
        </div>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 justify-between">
          <div>
            <div className="p-4">
              <p>Olá{session.user?.name ? `, ${session.user.name}` : ''}!</p>
            </div>
            <div className="divider"></div>
            <li tabIndex={1}>
              <a>
                <FaUser />
                Perfil
              </a>
            </li>
            <li tabIndex={2}>
              <a>
                <FaCog />
                Configurações
              </a>
            </li>
            <li tabIndex={3}>
              <a onClick={() => signOut({ callbackUrl: '/' })}>
                <FaSignOutAlt /> Sair
              </a>
            </li>
          </div>
          <p className="p-4">Bodyfit</p>
        </ul>
      </div>
    </div>
  )
}
