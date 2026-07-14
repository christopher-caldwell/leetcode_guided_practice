import { describe, expect, it } from 'vitest'
import type { LessonManifest, TimerState } from '../src/core/models.js'
import {
  completeTimer,
  elapsedMs,
  pauseTimer,
  resetTimer,
  startTimer,
  targetMinutes,
  timerApplies,
} from '../src/core/timer.js'

const lesson = {
  version: 1,
  id: '01-example',
  order: 1,
  title: 'Example',
  kind: 'lesson',
  difficulty: 'foundation',
  skills: ['example'],
  prerequisite: 'None',
  functionNames: ['example'],
  source: 'solutions/typescript/solution.ts',
  publicTest: 'solutions/typescript/public.test.ts',
  recommendedMinutes: 30,
  hints: ['one', 'two', 'three'],
  reviewOf: [],
  directory: '/tmp/example',
} satisfies LessonManifest

const fresh = (): TimerState => ({
  accumulatedMs: 0,
  startedAt: null,
  segments: 0,
  completedMs: null,
})

describe('persisted timer transitions', () => {
  it('does not start implicitly and accumulates explicit segments', () => {
    const timer = fresh()
    expect(elapsedMs(timer, Date.parse('2026-01-01T00:10:00.000Z'))).toBe(0)
    expect(startTimer(timer, new Date('2026-01-01T00:00:00.000Z'))).toBe('started')
    expect(startTimer(timer, new Date('2026-01-01T00:01:00.000Z'))).toBe('already-running')
    expect(elapsedMs(timer, Date.parse('2026-01-01T00:05:00.000Z'))).toBe(300_000)
    expect(pauseTimer(timer, new Date('2026-01-01T00:05:00.000Z'))).toBe('paused')
    expect(timer.accumulatedMs).toBe(300_000)
    expect(startTimer(timer, new Date('2026-01-01T00:10:00.000Z'))).toBe('started')
    expect(completeTimer(timer, new Date('2026-01-01T00:12:00.000Z'))).toBe(420_000)
    expect(timer.completedMs).toBe(420_000)
    expect(timer.segments).toBe(2)
  })

  it('resets only timer fields', () => {
    const timer: TimerState = {
      accumulatedMs: 10,
      startedAt: '2026-01-01T00:00:00.000Z',
      segments: 2,
      completedMs: 10,
    }
    resetTimer(timer)
    expect(timer).toEqual(fresh())
  })

  it('applies modes and override targets predictably', () => {
    expect(timerApplies({ timerMode: 'off' }, lesson)).toBe(false)
    expect(timerApplies({ timerMode: 'all' }, lesson)).toBe(true)
    expect(timerApplies({ timerMode: 'checkpoints' }, lesson)).toBe(false)
    expect(timerApplies({ timerMode: 'checkpoints' }, { ...lesson, kind: 'checkpoint' })).toBe(true)
    expect(targetMinutes({ timerMode: 'all' }, lesson)).toBe(30)
    expect(targetMinutes({ timerMode: 'all', timerMinutes: 45 }, lesson)).toBe(45)
  })
})
