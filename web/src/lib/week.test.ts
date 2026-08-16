import { describe, expect, it } from 'vitest'

import { formatWeekRange } from './week'

describe('formatWeekRange', () => {
  it('formata uma semana no meio do ano corretamente', () => {
    expect(formatWeekRange('2026-33')).toBe('10 a 16 de agosto de 2026')
  })

  it('inclui o ano no resultado', () => {
    const result = formatWeekRange('2026-33')
    expect(result).toContain('2026')
  })

  it('formata a semana 1 do ano corretamente', () => {
    const result = formatWeekRange('2026-01')
    expect(result).toContain('2026')
    expect(result).toMatch(/janeiro/)
  })

  it('lida com a última semana do ano (52 ou 53, dependendo do calendário ISO)', () => {
    const result = formatWeekRange('2026-53')
    expect(result).not.toContain('NaN')
    expect(result).not.toContain('Invalid')
  })
})
