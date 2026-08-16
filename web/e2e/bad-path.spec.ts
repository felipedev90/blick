import { expect, test } from '@playwright/test'

test('não é possível avaliar a mesma pessoa duas vezes na semana', async ({ page, request }) => {
  // Cria a primeira avaliação direto via API, mais rápido que repetir o fluxo de UI
  await request.post('http://localhost:8000/employees/16/evaluations', {
    data: {
      leader_id: 2,
      answers: [
        { question_key: 'delivery_results', score: 3 },
        { question_key: 'execution_quality', score: 3 },
        { question_key: 'learning_development', score: 3 },
        { question_key: 'problem_solving', score: 3 },
        { question_key: 'collaboration_leadership', score: 3 },
        { question_key: 'strategic_vision', score: 3 },
      ],
    },
  })

  await page.goto('/')
  await page.getByLabel('Avaliando como').selectOption('2')
  await page.getByRole('link', { name: 'Meu time' }).click()
  await page.getByRole('link', { name: /Paul Nakamura/ }).click()

  await expect(page.getByText('Você já avaliou essa pessoa essa semana.')).toBeVisible()
})

test('funcionário fora da hierarquia não é acessível', async ({ page }) => {
  await page.goto('/')

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/leader') && res.ok()),
    page.getByLabel('Avaliando como').selectOption('2'),
  ])

  // Rachel (18) é liderada da Carol, não do Bob
  await page.goto('/team/18')

  await expect(page.getByRole('heading', { name: 'Ops! Algo deu errado.' })).toBeVisible()
})
