'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'

import { cn } from '@/lib/cn'
import type { Employee } from '@/types/employee'

type LeaderSelectorProps = {
  employees: Employee[]
  currentLeaderId: number | null
  className?: string
}

type LeaderErrorBody = {
  error?: string
}

export function LeaderSelector({ employees, currentLeaderId, className }: LeaderSelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(currentLeaderId)
  const [error, setError] = useState<string | null>(null)

  // Guarda a última seleção pedida. Se uma resposta antiga chegar depois
  // de uma mais nova, ela é descartada em vez de sobrescrever o estado.
  const latestRequestId = useRef<number | null>(null)

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const leaderId = Number(event.target.value)
    const previousId = selectedId

    latestRequestId.current = leaderId
    setSelectedId(leaderId)
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/leader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderId }),
      })

      if (latestRequestId.current !== leaderId) return

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as LeaderErrorBody | null
        setSelectedId(previousId)
        setError(body?.error ?? 'Não foi possível trocar de líder.')
        return
      }

      startTransition(() => {
        router.refresh()
      })
    } catch {
      if (latestRequestId.current !== leaderId) return
      setSelectedId(previousId)
      setError('Falha de conexão com o servidor.')
    } finally {
      if (latestRequestId.current === leaderId) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor="leader-select" className="text-sm text-text-muted">
        Avaliando como
      </label>
      <select
        id="leader-select"
        value={selectedId ?? ''}
        onChange={handleChange}
        disabled={isSubmitting || isPending}
        className="rounded-md border border-border bg-surface px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <option value="" disabled>
          Selecione um líder
        </option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} — {employee.positionName}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
