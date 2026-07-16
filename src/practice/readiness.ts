import type { CoreLessonLink, CoreLessonMap, PracticeProblem } from './models.js'
import type { PracticeProgress } from './progress.js'

export function requiredCoreLessonOrder(links: CoreLessonLink[]): number {
  return Math.max(0, ...links.map((link) => Number(link.lesson_id.slice(0, 2))))
}

export function readyPracticeProblems(
  problems: PracticeProblem[],
  coreLessonMap: CoreLessonMap,
  progress: PracticeProgress,
  completedCoreOrder: number,
): PracticeProblem[] {
  return problems.filter(
    (problem) =>
      requiredCoreLessonOrder(coreLessonMap[problem.id] ?? []) <= completedCoreOrder &&
      !progress.problems[problem.id]?.completedAt,
  )
}
