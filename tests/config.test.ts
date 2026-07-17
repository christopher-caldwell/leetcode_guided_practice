import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/core/config.js'
import { diagnosisGuidancePercent } from '../src/providers/guidance.js'

describe('workshop configuration', () => {
  it('uses provider presence as the coaching switch', () => {
    expect(loadConfig({}).coachProvider).toBeUndefined()
    expect(loadConfig({ COACH_PROVIDER: '   ' }).coachProvider).toBeUndefined()
    expect(loadConfig({ COACH_PROVIDER: 'codex' }).coachProvider).toBe('codex')
    expect(loadConfig({ COACH_PROVIDER: 'CODEX' }).coachProvider).toBe('codex')
  })

  it('rejects every unsupported nonempty provider', () => {
    expect(() => loadConfig({ COACH_PROVIDER: 'claude' })).toThrow(/Invalid workshop environment/)
    expect(() => loadConfig({ COACH_PROVIDER: 'true' })).toThrow(/Invalid workshop environment/)
  })

  it('validates timer modes and minute overrides', () => {
    expect(loadConfig({ WORKSHOP_TIMER_MODE: 'all', WORKSHOP_TIMER_MINUTES: '25' })).toMatchObject({
      timerMode: 'all',
      timerMinutes: 25,
    })
    expect(() => loadConfig({ WORKSHOP_TIMER_MODE: 'sometimes' })).toThrow()
    expect(() => loadConfig({ WORKSHOP_TIMER_MINUTES: '0' })).toThrow()
    expect(() => loadConfig({ WORKSHOP_TIMER_MINUTES: 'forty' })).toThrow()
  })
})

describe('adaptive diagnosis guidance', () => {
  it('increases on every attempt with exponential growth and a cap', () => {
    const guidance = Array.from({ length: 8 }, (_, index) => diagnosisGuidancePercent(index + 1))
    expect(guidance).toEqual([15, 26, 43, 74, 100, 100, 100, 100])
  })
})
