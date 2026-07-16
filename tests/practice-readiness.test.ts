import { describe, expect, it } from 'vitest'
import {
  allPracticeProblems,
  loadCoreLessonMap,
  loadPracticeCatalog,
} from '../src/practice/catalog.js'
import type { PracticeProgress } from '../src/practice/progress.js'
import { readyPracticeProblems, requiredCoreLessonOrder } from '../src/practice/readiness.js'

const root = process.cwd()

describe('supplemental practice readiness', () => {
  it('offers only incomplete problems supported by completed core lessons', async () => {
    const [catalog, coreLessonMap] = await Promise.all([
      loadPracticeCatalog(root),
      loadCoreLessonMap(root),
    ])
    const progress: PracticeProgress = { version: 1, problems: {} }
    const ready = readyPracticeProblems(allPracticeProblems(catalog), coreLessonMap, progress, 3)
    expect(ready.length).toBeGreaterThan(0)
    expect(
      ready.every((problem) => requiredCoreLessonOrder(coreLessonMap[problem.id] ?? []) <= 3),
    ).toBe(true)

    progress.problems[ready[0]!.id] = {
      attempts: 1,
      lastAttemptedAt: '2026-07-14T12:00:00.000Z',
      completedAt: '2026-07-14T12:30:00.000Z',
      confidence: 4,
    }
    expect(
      readyPracticeProblems(allPracticeProblems(catalog), coreLessonMap, progress, 3).some(
        (problem) => problem.id === ready[0]!.id,
      ),
    ).toBe(false)
  })
})
