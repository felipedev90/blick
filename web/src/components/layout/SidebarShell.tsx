'use client'

import { Menu, PanelLeftClose, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type SidebarShellProps = {
  children: React.ReactNode
}

function SidebarShellInner({ children }: SidebarShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="icon"
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Abrir menu"
        className="fixed right-4 top-4 z-40 rounded-md lg:hidden"
      >
        <Menu aria-hidden="true" size={18} />
      </Button>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-bg/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          'flex h-full shrink-0 flex-col border-l border-border bg-bg transition-all duration-300',
          isCollapsed ? 'lg:w-0 lg:overflow-hidden lg:border-l-0' : 'lg:w-64',
          'fixed inset-y-0 right-0 z-50 w-64 translate-x-full lg:static lg:translate-x-0',
          isMobileOpen && 'translate-x-0',
        )}
      >
        <Button
          variant="icon"
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Fechar menu"
          className="absolute right-4 top-4 border-none lg:left-4 lg:hidden"
        >
          <X aria-hidden="true" size={18} />
        </Button>

        <Button
          variant="icon"
          type="button"
          onClick={() => setIsCollapsed(true)}
          aria-label="Ocultar menu"
          className="absolute right-4 top-4 hidden border-none lg:flex"
        >
          <PanelLeftClose aria-hidden="true" size={18} />
        </Button>

        {children}
      </aside>

      {isCollapsed ? (
        <Button
          variant="icon"
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label="Abrir menu"
          className="fixed right-4 lg:left-4 top-4 z-40 hidden rounded-md lg:flex"
        >
          <Menu aria-hidden="true" size={18} />
        </Button>
      ) : null}
    </>
  )
}

export function SidebarShell({ children }: SidebarShellProps) {
  const pathname = usePathname()
  return <SidebarShellInner key={pathname}>{children}</SidebarShellInner>
}
