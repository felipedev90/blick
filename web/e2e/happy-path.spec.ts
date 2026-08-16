import { expect, test } from '@playwright/test'

test('líder avalia um funcionário com sucesso', async ({ page }) => {
  await page.goto('/')

  // Seleciona o Bob como líder
  await page.getByLabel('Avaliando como').selectOption('2')

  // Navega pro time e entra na Grace (liderada direta, reservada pro E2E)
  await page.getByRole('link', { name: 'Meu time' }).click()
  await expect(page).toHaveURL('/team')
  await page.getByRole('link', { name: /Grace Kim/ }).click()
  await expect(page).toHaveURL(/\/team\/7/)

  // Preenche as 6 perguntas com nota 4
  const questionCount = 6
  const radios = page.getByRole('radio', { name: '4' })
  await expect(radios).toHaveCount(questionCount)
  for (let i = 0; i < questionCount; i++) {
    await radios.nth(i).locator('..').click()
  }

  await page.getByRole('button', { name: 'Enviar avaliação' }).click()

  await expect(page.getByText('Avaliação enviada com sucesso.')).toBeVisible()
})
