import type { WorkshopConfig } from './config.js'
import type { LessonManifest, WorkshopState } from './models.js'
import { targetMinutes } from './timer.js'

export interface SimulationEvidence {
  id: string
  title: string
  passed: boolean
  unassisted: boolean
  attempts: number
  hintsUsed: number
  diagnosesReceived: number
  solutionRevealed: boolean
  reflectionCompleted: boolean
  completedMs: number | null
  targetMinutes: number
  reviewScoresAcceptable: boolean | null
}

export interface ReadinessEvidence {
  simulations: SimulationEvidence[]
  unassistedCount: number
  acceptableReviewCount: number
  outstandingReviewIds: string[]
  finalUnassisted: boolean
  targetMet: boolean
}

export function assessReadiness(
  lessons: LessonManifest[],
  state: WorkshopState,
  config: WorkshopConfig,
): ReadinessEvidence {
  const simulations = lessons
    .filter((lesson) => lesson.kind === 'checkpoint' || lesson.kind === 'final')
    .map((lesson): SimulationEvidence => {
      const progress = state.lessons[lesson.id]!
      const scores = progress.latestReviewScores
      const passed = progress.passedAt !== null
      return {
        id: lesson.id,
        title: lesson.title,
        passed,
        unassisted:
          passed &&
          progress.hintsUsed === 0 &&
          progress.diagnosesReceived === 0 &&
          progress.solutionRevealedAt === null,
        attempts: progress.attempts,
        hintsUsed: progress.hintsUsed,
        diagnosesReceived: progress.diagnosesReceived,
        solutionRevealed: progress.solutionRevealedAt !== null,
        reflectionCompleted: progress.reflectionCompletedAt !== null,
        completedMs: progress.timer.completedMs,
        targetMinutes: targetMinutes(config, lesson),
        reviewScoresAcceptable: scores ? Object.values(scores).every((score) => score >= 3) : null,
      }
    })
  const unassistedCount = simulations.filter((simulation) => simulation.unassisted).length
  const acceptableReviewCount = simulations.filter(
    (simulation) => simulation.unassisted && simulation.reviewScoresAcceptable,
  ).length
  const outstandingReviewIds = lessons
    .filter((lesson) => state.lessons[lesson.id]!.reviewRequired)
    .map((lesson) => lesson.id)
  const final = simulations.at(-1)
  const finalUnassisted = final?.unassisted ?? false

  return {
    simulations,
    unassistedCount,
    acceptableReviewCount,
    outstandingReviewIds,
    finalUnassisted,
    targetMet: unassistedCount >= 2 && finalUnassisted && outstandingReviewIds.length === 0,
  }
}
