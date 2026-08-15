'use client'

import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-sans text-xl font-semibold text-text">Ops! Algo deu errado.</h1>
      <p className="text-text-muted">Não foi possível carregar os dados.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors duration-300"
      >
        Tentar novamente
      </button>
    </div>
  )
}
