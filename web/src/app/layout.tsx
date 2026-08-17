import type { Metadata } from 'next'
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'

import { Sidebar } from '@/components/layout/Sidebar'
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
  description:
    'Plataforma de avaliação de desempenho hierárquica. Líderes avaliam seus liderados diretos e indiretos em critérios ponderados, com histórico e visão consolidada do time.',
  openGraph: {
    title: 'Blick',
    description: 'Plataforma de avaliação de desempenho hierárquica.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blick',
    description: 'Plataforma de avaliação de desempenho hierárquica.',
  },
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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
