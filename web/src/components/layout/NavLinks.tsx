'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { href: '/', label: 'Avaliações do time' },
  { href: '/team', label: 'Meu time' },
  { href: '/history', label: 'Histórico' },
] as const

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-sm transition-colors duration-300',
              isActive ? 'bg-surface text-text' : 'text-text-muted hover:text-text',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
