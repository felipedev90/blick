import type { Answer } from './question'

export type EvaluationSummary = {
  id: number
  leaderId: number
  leaderName: string
  weekKey: string
  weightedScore: number
  answers: Answer[]
}

export type EvaluationHistoryEntry = {
  id: number
  leaderId: number
  leaderName: string
  weekKey: string
  weightedScore: number
}

export type EvaluationInput = {
  answers: Answer[]
}
