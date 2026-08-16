import { LeaderSelector } from '@/components/sections/LeaderSelector'
import { NavLinks } from '@/components/layout/NavLinks'
import { SidebarShell } from '@/components/layout/SidebarShell'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { getEmployees } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { getTheme } from '@/lib/theme'

export async function Sidebar() {
  const [employees, leaderId, theme] = await Promise.all([
    getEmployees(),
    getLeaderId(),
    getTheme(),
  ])

  return (
    <SidebarShell>
      <div className="flex flex-col gap-4 p-6">
        <span className="font-mono text-xl font-semibold uppercase tracking-widest text-accent">
          Blick
        </span>
        <LeaderSelector employees={employees} currentLeaderId={leaderId} />
      </div>

      <nav className="flex-1 overflow-y-auto px-4" aria-label="Navegação principal">
        {leaderId !== null ? <NavLinks /> : null}
      </nav>

      <div className="flex items-center justify-around border-t border-border p-6">
        <ThemeToggle initialTheme={theme} />
        <span className="text-xs text-text-muted">
          Desenvolvido por <br />
          <span className="text-accent">Felipe Augusto</span>
        </span>
      </div>
    </SidebarShell>
  )
}
