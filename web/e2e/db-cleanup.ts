import { Client } from 'pg'

// IDs reservados pra E2E, liderados diretos do Bob (2).
//  Não usar em testes manuais nem reaproveitar em pytest, pra evitar colisão de dado.
export const E2E_EMPLOYEE_IDS = [7, 16] // Grace Kim, Paul Nakamura

export async function cleanE2eEvaluations() {
  const client = new Client({
    connectionString: 'postgresql://blick:blick@localhost:5432/blick',
  })
  await client.connect()
  await client.query('DELETE FROM evaluation WHERE employee_id = ANY($1)', [E2E_EMPLOYEE_IDS])
  await client.end()
}
