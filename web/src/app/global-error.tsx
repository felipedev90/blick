'use client'

import { useEffect } from 'react'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg p-6 text-center">
          <h1 className="font-sans text-xl font-semibold text-text">
            Não foi possível carregar o Blick.
          </h1>
          <p className="text-text-muted">Tente recarregar a página.</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors duration-300"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
