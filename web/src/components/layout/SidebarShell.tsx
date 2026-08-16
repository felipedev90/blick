'use client'

import { Menu, PanelLeftClose, X } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/cn'

type SidebarShellProps = {
  children: React.ReactNode
}

export function SidebarShell({ children }: SidebarShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Abrir menu"
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text lg:hidden cursor-pointer"
      >
        <Menu aria-hidden="true" size={18} />
      </button>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-bg/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-border bg-bg transition-all duration-300',
          isCollapsed ? 'lg:w-0 lg:overflow-hidden lg:border-r-0' : 'lg:w-64',
          'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full lg:static lg:translate-x-0',
          isMobileOpen && 'translate-x-0',
        )}
      >
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Fechar menu"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-text-muted cursor-pointer lg:hidden "
        >
          <X aria-hidden="true" size={18} />
        </button>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          aria-label="Ocultar menu"
          className="absolute right-4 top-4 hidden h-8 w-8 items-center justify-center text-text-muted  hover:text-text lg:flex cursor-pointer"
        >
          <PanelLeftClose aria-hidden="true" size={18} />
        </button>

        {children}
      </aside>

      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label="Abrir menu"
          className="fixed left-4 top-4 z-40 hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text lg:flex cursor-pointer"
        >
          <Menu aria-hidden="true" size={18} />
        </button>
      ) : null}
    </>
  )
}
