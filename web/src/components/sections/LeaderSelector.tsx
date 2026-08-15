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

  async function handleClear() {
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/leader', { method: 'DELETE' })

      if (!res.ok) {
        setError('Não foi possível trocar de líder.')
        return
      }

      setSelectedId(null)
      startTransition(() => {
        router.refresh()
      })
    } catch {
      setError('Falha de conexão.')
    } finally {
      setIsSubmitting(false)
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
      {selectedId !== null ? (
        <button
          type="button"
          onClick={handleClear}
          disabled={isSubmitting || isPending}
          className="text-left text-xs text-text-muted underline-offset-2 hover:text-text hover:underline cursor-pointer"
        >
          Trocar líder
        </button>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
