"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  return (
    <nav className="flex gap-4 mb-8 justify-center items-center">
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
      className={`${selected ? "text-blue-500" : "text-white"} ${
        selected ? "border-b-2" : "border-b-0"
      } border-blue-500 text-center`}
    >
      {name}
    </Link>
  )
}
