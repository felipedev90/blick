import { LeaderSelector } from '@/components/sections/LeaderSelector'
import { NavLinks } from '@/components/layout/NavLinks'
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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border">
      <div className="flex flex-col gap-4 p-6">
        <span className="font-mono text-xl font-semibold uppercase tracking-widest text-accent">
          Blick
        </span>
        <LeaderSelector employees={employees} currentLeaderId={leaderId} />
      </div>

      <nav className="flex-1 px-4" aria-label="Navegação principal">
        {leaderId !== null ? <NavLinks /> : null}
      </nav>

      <div className="border-t border-border p-6">
        <ThemeToggle initialTheme={theme} />
      </div>
    </aside>
  )
}
