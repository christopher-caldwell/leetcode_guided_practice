import { describe, expect, it } from 'vitest'
import { recordPracticeAttempt, recordPracticeCompletion } from '../src/practice/progress.js'
import type { PracticeProgress } from '../src/practice/progress.js'

describe('supplemental practice progress', () => {
  it('tracks attempts and completion independently from core lesson state', () => {
    const progress: PracticeProgress = { version: 1, problems: {} }
    const now = new Date('2026-07-14T12:00:00.000Z')
    recordPracticeAttempt(progress, 'set-01', now)
    recordPracticeAttempt(progress, 'set-01', now)
    recordPracticeCompletion(progress, 'set-01', 4, now)
    expect(progress.problems).toEqual({
      'set-01': {
        attempts: 2,
        lastAttemptedAt: now.toISOString(),
        completedAt: now.toISOString(),
        confidence: 4,
      },
    })
  })
})
