import type { Metadata } from 'next'
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'

import { Navbar } from '@/components/layout/Navbar'
import { cn } from '@/lib/cn'
import { getEmployees } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { getTheme } from '@/lib/theme'

import './globals.css'

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blick',
  description: 'Avaliação de desempenho hierárquica',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, employees, leaderId] = await Promise.all([
    getTheme(),
    getEmployees(),
    getLeaderId(),
  ])
  const currentLeader = employees.find((employee) => employee.id === leaderId) ?? null

  return (
    <html
      lang="pt-BR"
      data-theme={theme ?? undefined}
      className={cn(instrumentSans.variable, plexMono.variable)}
    >
      <body>
        <Navbar leaderName={currentLeader?.name ?? null} theme={theme} />
        {children}
      </body>
    </html>
  )
}
