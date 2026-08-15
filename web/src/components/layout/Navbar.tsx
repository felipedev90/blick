import { NavLinks } from '@/components/layout/NavLinks'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Theme } from '@/lib/theme'

type NavbarProps = {
  leaderName: string | null
  theme: Theme | null
}

export function Navbar({ leaderName, theme }: NavbarProps) {
  return (
    <nav className="w-full border-b border-border px-4 py-3">
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-4 lg:flex lg:gap-6">
        <span className="font-mono text-xl font-semibold uppercase tracking-widest text-accent lg:text-2xl">
          Blick
        </span>

        <div className="justify-self-end lg:order-last">
          <ThemeToggle initialTheme={theme} />
        </div>

        <span className="text-sm text-text-muted">
          {leaderName ? (
            <>
              Olá, <span className="text-text">{leaderName}</span>
            </>
          ) : null}
        </span>

        <div className="justify-self-end lg:ml-auto">
          <NavLinks />
        </div>
      </div>
    </nav>
  )
}
