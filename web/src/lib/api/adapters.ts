import type { Employee, TeamMember, TeamMemberEvaluation } from '@/types/employee'
import type { EvaluationHistoryEntry, EvaluationSummary } from '@/types/evaluation'
import type { Answer, QuestionKey, Score } from '@/types/question'

// Shapes crus da API (snake_case). Não são reexportados pelo barrel: não vazam do módulo.
export type RawEmployee = {
  id: number
  name: string
  position_name: string
}

export type RawTeamMember = RawEmployee & {
  depth: number
  parent_id: number
}

type RawAnswer = {
  question_key: QuestionKey
  score: Score
}

export type RawEvaluationSummary = {
  id: number
  leader_id: number
  leader_name: string
  week_key: string
  weighted_score: number
  answers: RawAnswer[]
}

export type RawEvaluationHistoryEntry = {
  id: number
  leader_id: number
  leader_name: string
  week_key: string
  weighted_score: number
}

export type RawTeamMemberEvaluation = RawTeamMember & {
  evaluation_id: number | null
  evaluation_leader_id: number | null
  evaluation_leader_name: string | null
  week_key: string | null
  weighted_score: number | null
}

export function toEmployee(raw: RawEmployee): Employee {
  return { id: raw.id, name: raw.name, positionName: raw.position_name }
}

export function toTeamMember(raw: RawTeamMember): TeamMember {
  return { ...toEmployee(raw), depth: raw.depth, parentId: raw.parent_id }
}

function toAnswer(raw: RawAnswer): Answer {
  return { questionKey: raw.question_key, score: raw.score }
}

export function toEvaluationSummary(raw: RawEvaluationSummary): EvaluationSummary {
  return {
    id: raw.id,
    leaderId: raw.leader_id,
    leaderName: raw.leader_name,
    weekKey: raw.week_key,
    weightedScore: raw.weighted_score,
    answers: raw.answers.map(toAnswer),
  }
}

export function toHistoryEntry(raw: RawEvaluationHistoryEntry): EvaluationHistoryEntry {
  return {
    id: raw.id,
    leaderId: raw.leader_id,
    leaderName: raw.leader_name,
    weekKey: raw.week_key,
    weightedScore: raw.weighted_score,
  }
}

export function toTeamMemberEvaluation(raw: RawTeamMemberEvaluation): TeamMemberEvaluation {
  return {
    ...toTeamMember(raw),
    evaluationId: raw.evaluation_id,
    evaluationLeaderId: raw.evaluation_leader_id,
    evaluationLeaderName: raw.evaluation_leader_name,
    weekKey: raw.week_key,
    weightedScore: raw.weighted_score,
  }
}
