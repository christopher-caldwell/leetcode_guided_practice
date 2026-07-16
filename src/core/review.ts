import type { LessonManifest, LessonProgress, WorkshopState } from './models.js'

export function isReviewEligible(lesson: LessonManifest, state: WorkshopState): boolean {
  const progress = state.lessons[lesson.id]!
  return progress.verifiedAt !== null || progress.passedAt !== null
}

export function selectReviewLesson(
  lessons: LessonManifest[],
  state: WorkshopState,
  requestedId?: string,
): LessonManifest | null {
  const explicit = requestedId?.trim()
  if (explicit) return lessons.find((lesson) => lesson.id === explicit) ?? null
  return (
    lessons.find(
      (lesson) => isReviewEligible(lesson, state) && state.lessons[lesson.id]!.reviewRequired,
    ) ??
    [...lessons].reverse().find((lesson) => isReviewEligible(lesson, state)) ??
    null
  )
}

export function recordOfflineReview(progress: LessonProgress, now = new Date()): boolean {
  if (!progress.reflectionCompletedAt) return false
  progress.offlineReviewCompletedAt = now.toISOString()
  progress.reviewRequired = false
  return true
}
