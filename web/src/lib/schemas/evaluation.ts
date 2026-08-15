import { z } from 'zod'

// Os 6 critérios são fixos pelo domínio do case.
export const evaluationFormSchema = z.object({
  delivery_results: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
  execution_quality: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
  learning_development: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
  problem_solving: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
  collaboration_leadership: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
  strategic_vision: z.enum(['1', '2', '3', '4'], { message: 'Selecione uma nota' }),
})

export type EvaluationFormValues = z.infer<typeof evaluationFormSchema>
