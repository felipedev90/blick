import { cleanE2eEvaluations } from './db-cleanup'

export default async function globalSetup() {
  await cleanE2eEvaluations()
}
