import 'server-only'

import type { Employee, TeamMember } from '@/types/employee'
import type { EvaluationHistoryEntry, EvaluationInput, EvaluationSummary } from '@/types/evaluation'

import { toEmployee, toEvaluationSummary, toHistoryEntry, toTeamMember } from './adapters'
import type {
  RawEmployee,
  RawEvaluationHistoryEntry,
  RawEvaluationSummary,
  RawTeamMember,
} from './adapters'
import { ApiError } from './errors'

function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL
  if (!url) {
    throw new Error('API_BASE_URL não está definida no ambiente')
  }
  return url
}

type ApiErrorBody = {
  detail?: string
}

async function extractErrorDetail(res: Response): Promise<string | null> {
  try {
    const body = (await res.json()) as ApiErrorBody
    return body.detail ?? null
  } catch {
    return null
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  let res: Response
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch (error) {
    // Falha de conexão (API fora do ar, DNS) e abort por timeout cai no mesmo catch.
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(0, `Timeout ao conectar na API em ${path}`)
    }
    throw new ApiError(0, `Falha de conexão com a API em ${path}`)
  } finally {
    clearTimeout(timeout)
  }

  if (!res.ok) {
    const detail = await extractErrorDetail(res)
    throw new ApiError(res.status, detail ?? `API respondeu ${res.status} em ${path}`)
  }

  return (await res.json()) as T
}

export async function getEmployees(): Promise<Employee[]> {
  const raw = await apiFetch<RawEmployee[]>('/employees', {
    next: { revalidate: 300 },
  })
  return raw.map(toEmployee)
}

export async function getTeam(leaderId: number): Promise<TeamMember[]> {
  const raw = await apiFetch<RawTeamMember[]>(`/employees/${leaderId}/team`, {
    next: { revalidate: 300 },
  })
  return raw.map(toTeamMember)
}

export async function getCurrentEvaluation(
  employeeId: number,
  viewerId: number,
): Promise<EvaluationSummary | null> {
  try {
    const raw = await apiFetch<RawEvaluationSummary>(
      `/employees/${employeeId}/evaluations/current?viewer_id=${viewerId}`,
      { cache: 'no-store' },
    )
    return toEvaluationSummary(raw)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function getEvaluationHistory(
  employeeId: number,
  viewerId: number,
): Promise<EvaluationHistoryEntry[]> {
  const raw = await apiFetch<RawEvaluationHistoryEntry[]>(
    `/employees/${employeeId}/evaluations/history?viewer_id=${viewerId}`,
    { cache: 'no-store' },
  )
  return raw.map(toHistoryEntry)
}

// Chamado pelo Route Handler (server). leaderId vem do cookie httpOnly, não do body do cliente.
export async function createEvaluation(
  employeeId: number,
  leaderId: number,
  input: EvaluationInput,
): Promise<{ id: number }> {
  const body = {
    leader_id: leaderId,
    answers: input.answers.map((answer) => ({
      question_key: answer.questionKey,
      score: answer.score,
    })),
  }

  return apiFetch<{ id: number }>(`/employees/${employeeId}/evaluations`, {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  })
}
