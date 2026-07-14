import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/core/config.js'
import { shouldCoachAttempt } from '../src/providers/factory.js'

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

describe('adaptive diagnosis schedule', () => {
  it('coaches only on Fibonacci-numbered failed attempts', () => {
    const coached = Array.from({ length: 15 }, (_, index) => index + 1).filter(shouldCoachAttempt)
    expect(coached).toEqual([1, 2, 3, 5, 8, 13])
  })
})
