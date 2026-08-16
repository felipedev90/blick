import { cleanE2eEvaluations } from './db-cleanup'

export default async function globalTeardown() {
  await cleanE2eEvaluations()
}
