import { describe, expect, it } from 'vitest'
import type { LessonManifest } from '../src/core/models.js'
import { WorkshopStateSchema } from '../src/core/models.js'
import { assessReadiness } from '../src/core/readiness.js'
import { recordOfflineReview, selectReviewLesson } from '../src/core/review.js'

function lesson(order: number, kind: 'checkpoint' | 'final'): LessonManifest {
  return {
    version: 1,
    id: `${String(order).padStart(2, '0')}-simulation`,
    order,
    title: `Simulation ${order}`,
    kind,
    difficulty: 'medium',
    skills: ['mixed'],
    prerequisite: 'Earlier lessons',
    functionNames: ['solve'],
    source: 'solutions/typescript/solution.ts',
    publicTest: 'solutions/typescript/public.test.ts',
    recommendedMinutes: 30,
    hints: ['one', 'two', 'three'],
    reviewOf: [],
    directory: `/tmp/${order}`,
  }
}

const lessons = [lesson(1, 'checkpoint'), lesson(2, 'checkpoint'), lesson(3, 'final')]
const passed = '2026-01-01T00:00:00.000Z'

function state() {
  return WorkshopStateSchema.parse({
    version: 1,
    lessons: Object.fromEntries(
      lessons.map((item) => [
        item.id,
        { verifiedAt: passed, reflectionCompletedAt: passed, passedAt: passed },
      ]),
    ),
  })
}

describe('readiness evidence', () => {
  it('counts only runs with no hints, diagnoses, or reveal as unassisted', () => {
    const progress = state()
    progress.lessons[lessons[0]!.id]!.hintsUsed = 1
    progress.lessons[lessons[1]!.id]!.diagnosesReceived = 1
    const evidence = assessReadiness(lessons, progress, { timerMode: 'checkpoints' })
    expect(evidence.unassistedCount).toBe(1)
    expect(evidence.finalUnassisted).toBe(true)
    expect(evidence.targetMet).toBe(true)
  })

  it('keeps provider scores and assistance advisory while requiring cleared review debt', () => {
    const progress = state()
    let evidence = assessReadiness(lessons, progress, { timerMode: 'checkpoints' })
    expect(evidence.targetMet).toBe(true)
    expect(evidence.acceptableReviewCount).toBe(0)

    progress.lessons[lessons[0]!.id]!.reviewRequired = true
    evidence = assessReadiness(lessons, progress, { timerMode: 'checkpoints' })
    expect(evidence.targetMet).toBe(false)

    progress.lessons[lessons[0]!.id]!.reviewRequired = false
    progress.lessons[lessons[2]!.id]!.solutionRevealedAt = passed
    evidence = assessReadiness(lessons, progress, { timerMode: 'checkpoints' })
    expect(evidence.finalUnassisted).toBe(false)
    expect(evidence.targetMet).toBe(true)
  })

  it('retains completed timer evidence without making time a correctness gate', () => {
    const progress = state()
    progress.lessons[lessons[2]!.id]!.timer.completedMs = 45 * 60_000
    const evidence = assessReadiness(lessons, progress, {
      timerMode: 'checkpoints',
      timerMinutes: 30,
    })
    expect(evidence.simulations.at(-1)).toMatchObject({
      completedMs: 45 * 60_000,
      targetMinutes: 30,
    })
    expect(evidence.targetMet).toBe(true)
  })
})

describe('review selection', () => {
  it('drains queued lessons deterministically and allows an explicit lesson id', () => {
    const progress = state()
    progress.lessons[lessons[0]!.id]!.reviewRequired = true
    progress.lessons[lessons[1]!.id]!.reviewRequired = true
    expect(selectReviewLesson(lessons, progress)?.id).toBe(lessons[0]!.id)
    expect(selectReviewLesson(lessons, progress, lessons[2]!.id)?.id).toBe(lessons[2]!.id)
  })

  it('clears revealed-solution debt offline after deterministic verification', () => {
    const progress = state().lessons[lessons[0]!.id]!
    progress.reviewRequired = true
    progress.verifiedAt = null
    expect(recordOfflineReview(progress)).toBe(false)
    expect(progress.reviewRequired).toBe(true)

    progress.verifiedAt = passed
    expect(recordOfflineReview(progress, new Date(passed))).toBe(true)
    expect(progress).toMatchObject({
      reviewRequired: false,
      offlineReviewCompletedAt: passed,
    })
  })
})
