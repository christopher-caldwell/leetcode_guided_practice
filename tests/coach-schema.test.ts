import { mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DiagnosisResponseSchema,
  HintResponseSchema,
  ReviewResponseSchema,
} from '../src/providers/coach.js'
import { CodexCoachProvider, parseCoachResponse } from '../src/providers/codex.js'

describe('normalized coaching responses', () => {
  it('accepts bounded structured hints', () => {
    expect(
      HintResponseSchema.parse({
        focus: 'Invariant',
        hint: 'Name what the retained prefix guarantees.',
        question: 'What becomes safe after that guarantee holds?',
      }),
    ).toBeTruthy()
    expect(() =>
      HintResponseSchema.parse({ focus: 'x', hint: 'x'.repeat(281), question: 'why?' }),
    ).toThrow()
  })

  it('rejects unknown diagnosis categories', () => {
    expect(() =>
      DiagnosisResponseSchema.parse({
        category: 'magic',
        whatIsWorking: 'The contract is clear.',
        observation: 'One condition is missing.',
        nextStep: 'Trace empty input.',
        question: 'What should it return?',
      }),
    ).toThrow()
  })

  it('constrains advisory rubric scores', () => {
    const valid = {
      scores: { correctness: 4, complexity: 3, clarity: 4, communication: 3 },
      strengths: ['Clear invariant.'],
      improvements: ['Define n earlier.'],
      tradeoff: 'Extra storage avoids a repeated scan.',
      summary: 'Passing with one communication improvement.',
    }
    expect(ReviewResponseSchema.parse(valid)).toEqual(valid)
    expect(() =>
      ReviewResponseSchema.parse({ ...valid, scores: { ...valid.scores, complexity: 5 } }),
    ).toThrow()
  })

  it('parses valid JSON and rejects malformed or schema-invalid provider output', () => {
    const valid = JSON.stringify({
      focus: 'Boundary',
      hint: 'Name the candidate region before changing it.',
      question: 'Which update can only move forward?',
    })
    expect(parseCoachResponse(HintResponseSchema, valid).focus).toBe('Boundary')
    expect(() => parseCoachResponse(HintResponseSchema, '{not-json')).toThrow()
    expect(() =>
      parseCoachResponse(HintResponseSchema, JSON.stringify({ focus: 'missing fields' })),
    ).toThrow()
  })

  it('reports an unavailable provider executable without requiring a live model', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'coach-unavailable-'))
    const provider = new CodexCoachProvider(root, 'definitely-not-a-real-coach-executable')
    await expect(
      provider.hint({
        lesson: {
          version: 1,
          id: '01-example',
          order: 1,
          title: 'Example',
          kind: 'lesson',
          difficulty: 'foundation',
          skills: ['reasoning'],
          prerequisite: 'None',
          functionNames: ['example'],
          source: 'solutions/typescript/solution.ts',
          publicTest: 'solutions/typescript/public.test.ts',
          recommendedMinutes: 30,
          hints: ['one', 'two', 'three'],
          reviewOf: [],
          directory: root,
        },
        source: 'throw new Error("TODO")',
        analysis: '# Analysis',
        attempts: 0,
        hintsUsed: 0,
        failures: [],
      }),
    ).rejects.toThrow(/ENOENT|not-a-real/)
  })
})
