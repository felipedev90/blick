import type { QuestionKey } from '@/types/question'

export type QuestionDefinition = {
  key: QuestionKey
  label: string
  weight: number
}

export const QUESTIONS = [
  { key: 'delivery_results', label: 'Entrega de Resultados', weight: 25 },
  { key: 'execution_quality', label: 'Execução e Qualidade do Trabalho', weight: 20 },
  { key: 'learning_development', label: 'Capacidade de Aprendizado e Desenvolvimento', weight: 20 },
  { key: 'problem_solving', label: 'Resolução de Problemas e Pensamento Crítico', weight: 15 },
  { key: 'collaboration_leadership', label: 'Colaboração, Influência e Liderança', weight: 10 },
  { key: 'strategic_vision', label: 'Visão Estratégica e Potencial de Crescimento', weight: 10 },
] as const satisfies readonly QuestionDefinition[]
