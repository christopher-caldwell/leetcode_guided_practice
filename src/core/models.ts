import { z } from 'zod'

export const analysisSections = [
  'Clarifying questions',
  'Examples and edge cases',
  'Baseline approach',
  'Cost analysis',
  'Optimized approach',
  'Invariant and correctness',
  'Final complexity',
] as const

export const LessonManifestSchema = z.object({
  version: z.literal(1),
  id: z.string().regex(/^\d{2}-[a-z0-9-]+$/),
  order: z.number().int().min(1).max(99),
  title: z.string().min(1),
  kind: z.enum(['lesson', 'checkpoint', 'final']),
  difficulty: z.enum(['foundation', 'easy', 'medium']),
  skills: z.array(z.string().min(1)).min(1),
  prerequisite: z.string().min(1),
  functionNames: z.array(z.string().min(1)).min(1),
  source: z.string().min(1),
  publicTest: z.string().min(1),
  recommendedMinutes: z.number().int().positive(),
  hints: z.array(z.string().min(1)).length(3),
  reviewOf: z.array(z.number().int().positive()).default([]),
})

export type LessonManifest = z.infer<typeof LessonManifestSchema> & {
  directory: string
}

export const TimerStateSchema = z.object({
  accumulatedMs: z.number().nonnegative().default(0),
  startedAt: z.string().datetime().nullable().default(null),
  segments: z.number().int().nonnegative().default(0),
  completedMs: z.number().nonnegative().nullable().default(null),
})

export type TimerState = z.infer<typeof TimerStateSchema>

export const LessonProgressSchema = z.object({
  attempts: z.number().int().nonnegative().default(0),
  hintsUsed: z.number().int().nonnegative().default(0),
  diagnosesReceived: z.number().int().nonnegative().default(0),
  verifiedAt: z.string().datetime().nullable().default(null),
  reflectionCompletedAt: z.string().datetime().nullable().default(null),
  passedAt: z.string().datetime().nullable().default(null),
  solutionRevealedAt: z.string().datetime().nullable().default(null),
  reviewRequired: z.boolean().default(false),
  latestReviewPath: z.string().nullable().default(null),
  offlineReviewCompletedAt: z.string().datetime().nullable().default(null),
  latestReviewScores: z
    .object({
      correctness: z.number().int().min(1).max(4),
      complexity: z.number().int().min(1).max(4),
      clarity: z.number().int().min(1).max(4),
      communication: z.number().int().min(1).max(4),
    })
    .nullable()
    .default(null),
  timer: TimerStateSchema.default({
    accumulatedMs: 0,
    startedAt: null,
    segments: 0,
    completedMs: null,
  }),
})

export type LessonProgress = z.infer<typeof LessonProgressSchema>

export const WorkshopStateSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), LessonProgressSchema),
})

export type WorkshopState = z.infer<typeof WorkshopStateSchema>

export type FailureCategory =
  'analysis' | 'typecheck' | 'correctness' | 'edge-case' | 'contract' | 'complexity' | 'runtime'

export interface CheckFailure {
  category: FailureCategory
  summary: string
  evidence: string
}

export interface CheckResult {
  passed: boolean
  failures: CheckFailure[]
  output: string
}
