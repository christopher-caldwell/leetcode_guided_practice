import { z } from 'zod'

const JsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
)

export const PracticeProblemSchema = z.object({
  id: z.string().regex(/^[a-z]+-[0-9]{2}$/),
  origin: z.string().regex(/^[A-Z]+[0-9]+$/),
  title: z.string().min(1),
  primary_concept: z.string().min(1),
  secondary_concepts: z.array(z.string().min(1)),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  statement: z.string().min(40),
  constraints: z.array(z.string().min(1)).min(2),
  expected_complexity: z.object({
    time: z.string().min(1),
    space: z.string().min(1),
  }),
  answer_type: z.enum([
    'boolean',
    'value',
    'number',
    'index',
    'indices',
    'values',
    'groups',
    'intervals',
    'object',
  ]),
  generator_parameters: z.record(z.string(), z.array(JsonValueSchema).min(1)),
  edge_cases: z.array(z.string().min(1)).min(2),
  examples: z
    .array(
      z.object({
        input: JsonValueSchema,
        output: JsonValueSchema,
        explanation: z.string().min(1).optional(),
      }),
    )
    .min(1),
  related_lessons: z
    .array(
      z.object({
        id: z.string().regex(/^\d{2}-[a-z0-9-]+$/),
        relationship: z.literal('variant'),
        distinction: z.string().min(20),
      }),
    )
    .default([]),
})

export const PracticeGroupSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  recognition_signals: z.array(z.string().min(20)).min(2),
  common_wrong_approaches: z.array(z.string().min(20)).min(2),
  problems: z.array(PracticeProblemSchema).min(3),
})

export const PracticeCatalogSchema = z.object({
  version: z.literal(1),
  groups: z.array(PracticeGroupSchema).min(1),
})

export const CoreLessonLinkSchema = z.object({
  lesson_id: z.string().regex(/^\d{2}-[a-z0-9-]+$/),
  relationship: z.enum(['foundation', 'reinforces', 'extends', 'combines']),
  connection: z.string().min(20),
})

export const CoreLessonMapSchema = z.record(
  z.string().regex(/^[a-z]+-[0-9]{2}$/),
  z.array(CoreLessonLinkSchema).min(1),
)

export const ConceptGuideSchema = z.object({
  blurb: z.string().min(120),
  recommended_after_lesson: z.number().int().min(1).max(24),
  resource: z
    .object({
      title: z.string().min(1),
      url: z.url(),
      format: z.enum(['video-lesson', 'worked-example', 'course']),
      source: z.string().min(1),
    })
    .nullable(),
  hint_ladder: z.array(z.string().min(30)).length(3),
})

export const ConceptGuideMapSchema = z.record(z.string().regex(/^[a-z-]+$/), ConceptGuideSchema)

export const PracticeContractMapSchema = z.record(
  z.string().regex(/^[a-z]+-[0-9]{2}$/),
  z.string().min(20),
)

export const GeneratedPracticeVariantSchema = z.object({
  title: z.string().min(8).max(100),
  statement: z.string().min(60).max(800),
  constraints: z.array(z.string().min(8).max(180)).min(3).max(6),
  examples: z
    .array(
      z.object({
        input: z.string().min(1).max(500),
        output: z.string().min(1).max(500),
        explanation: z.string().min(1).max(400).nullable(),
      }),
    )
    .min(2)
    .max(4),
})

export const GeneratedPracticeAttemptSchema = z.object({
  version: z.literal(1),
  base_problem_id: z.string().regex(/^[a-z]+-[0-9]{2}$/),
  attempt_number: z.number().int().positive(),
  generated_at: z.string().datetime(),
  generator: z.literal('codex'),
  variant: GeneratedPracticeVariantSchema,
})

export type PracticeProblem = z.infer<typeof PracticeProblemSchema>
export type PracticeGroup = z.infer<typeof PracticeGroupSchema>
export type PracticeCatalog = z.infer<typeof PracticeCatalogSchema>
export type CoreLessonLink = z.infer<typeof CoreLessonLinkSchema>
export type CoreLessonMap = z.infer<typeof CoreLessonMapSchema>
export type ConceptGuide = z.infer<typeof ConceptGuideSchema>
export type ConceptGuideMap = z.infer<typeof ConceptGuideMapSchema>
export type PracticeContractMap = z.infer<typeof PracticeContractMapSchema>
export type GeneratedPracticeVariant = z.infer<typeof GeneratedPracticeVariantSchema>
export type GeneratedPracticeAttempt = z.infer<typeof GeneratedPracticeAttemptSchema>
