import { z } from 'zod'
import type { CheckFailure, LessonManifest } from '../core/models.js'

export interface CoachContext {
  lesson: LessonManifest
  source: string
  analysis: string
  attempts: number
  hintsUsed: number
  failures: CheckFailure[]
}

export const HintResponseSchema = z.object({
  focus: z.string().min(1).max(80),
  hint: z.string().min(1).max(280),
  question: z.string().min(1).max(220),
})

export const DiagnosisResponseSchema = z.object({
  category: z.enum([
    'analysis',
    'typecheck',
    'correctness',
    'edge-case',
    'contract',
    'complexity',
    'runtime',
  ]),
  whatIsWorking: z.string().min(1).max(360),
  observation: z.string().min(1).max(420),
  nextStep: z.string().min(1).max(280),
  question: z.string().min(1).max(220),
})

const ScoreSchema = z.number().int().min(1).max(4)

export const ReviewResponseSchema = z.object({
  scores: z.object({
    correctness: ScoreSchema,
    complexity: ScoreSchema,
    clarity: ScoreSchema,
    communication: ScoreSchema,
  }),
  strengths: z.array(z.string().min(1).max(240)).max(3),
  improvements: z.array(z.string().min(1).max(280)).max(3),
  tradeoff: z.string().min(1).max(360),
  summary: z.string().min(1).max(360),
})

export type HintResponse = z.infer<typeof HintResponseSchema>
export type DiagnosisResponse = z.infer<typeof DiagnosisResponseSchema>
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>

export interface CoachProvider {
  readonly name: string
  hint(context: CoachContext): Promise<HintResponse>
  diagnose(context: CoachContext): Promise<DiagnosisResponse>
  review(context: CoachContext): Promise<ReviewResponse>
}
