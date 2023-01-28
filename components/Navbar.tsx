'use client'
import Link from "next/link"
import {usePathname} from 'next/navigation'

export default function Navbar() {
  return (
    <nav className="flex gap-4 mb-8">
      <NavLink href="/" name="Block" />
      <NavLink href="/activities" name="Aktivitäten" />
    </nav>
  )
}

interface NavLinkProps {
  href: string
  name: string
}

function NavLink({ href, name }: NavLinkProps) {
  const pathname = usePathname()
  const selected = pathname === href

  return (
    <Link
      href={href}
      className={`${!selected ? "text-white" : "text-orange-500"} bg-blue-900 p-2 rounded w-36 text-center`}
    >
      {name}
    </Link>
  )
}
