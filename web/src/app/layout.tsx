import type { Metadata } from 'next'
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/cn'
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
  const theme = await getTheme()

  return (
    <html
      lang="pt-BR"
      data-theme={theme ?? undefined}
      className={cn(instrumentSans.variable, plexMono.variable)}
    >
      <body>
        <header className="flex justify-end p-4">
          <ThemeToggle initialTheme={theme} />
        </header>
        {children}
      </body>
    </html>
  )
}
