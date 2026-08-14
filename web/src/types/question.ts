export type QuestionKey =
  | 'delivery_results'
  | 'execution_quality'
  | 'learning_development'
  | 'problem_solving'
  | 'collaboration_leadership'
  | 'strategic_vision'

export type Score = 1 | 2 | 3 | 4

export type Answer = {
  questionKey: QuestionKey
  score: Score
}
