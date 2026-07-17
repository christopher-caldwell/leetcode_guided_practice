import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  AnalysisAssessmentResponseSchema,
  DiagnosisResponseSchema,
  HintResponseSchema,
  ReviewResponseSchema,
} from '../src/providers/coach.js'
import {
  coachEnvironment,
  codexExecutableCandidates,
  CodexCoachProvider,
  parseCoachResponse,
} from '../src/providers/codex.js'

describe('normalized coaching responses', () => {
  it('never substitutes a fallback for an explicitly selected executable', () => {
    expect(codexExecutableCandidates('/tmp/fake-codex')).toEqual(['/tmp/fake-codex'])
  })

  it('accepts a yes-or-no analysis verdict with feedback in either case', () => {
    expect(
      AnalysisAssessmentResponseSchema.parse({
        passed: true,
        feedback: 'The core explanation is sound; tighten the auxiliary-space justification.',
      }),
    ).toBeTruthy()
    expect(
      AnalysisAssessmentResponseSchema.parse({
        passed: false,
        feedback: 'The approach is identified, but the stated runtime contradicts the loop.',
      }),
    ).toBeTruthy()
    expect(() => AnalysisAssessmentResponseSchema.parse({ passed: true, feedback: '' })).toThrow()
  })

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

  it('passes only authentication/runtime necessities to the coaching process', () => {
    expect(
      coachEnvironment({
        PATH: '/bin',
        HOME: '/home/example',
        CODEX_HOME: '/home/example/.codex',
        AWS_SECRET_ACCESS_KEY: 'do-not-forward',
        DATABASE_URL: 'do-not-forward',
      }),
    ).toEqual({
      PATH: '/bin',
      HOME: '/home/example',
      CODEX_HOME: '/home/example/.codex',
    })
  })

  it('executes coaching from an isolated directory without forwarding unrelated secrets', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'coach-isolation-'))
    const executable = path.join(root, 'fake-codex.mjs')
    await writeFile(
      executable,
      `#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
const output = args[args.indexOf('--output-last-message') + 1]
writeFileSync(output, JSON.stringify({
  focus: process.cwd().endsWith('coach-sandbox') ? 'isolated' : 'wrong-directory',
  hint: process.env.WORKSHOP_TEST_SECRET ? 'secret leaked' : 'secret withheld',
  question: 'What is the smallest next observation?'
}))
`,
      'utf8',
    )
    await chmod(executable, 0o755)
    const previous = process.env.WORKSHOP_TEST_SECRET
    process.env.WORKSHOP_TEST_SECRET = 'must-not-be-forwarded'
    try {
      const result = await new CodexCoachProvider(root, executable).hint({
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
        source: 'return false',
        analysis: '# Analysis',
        attempts: 1,
        hintsUsed: 0,
        failures: [],
      })
      expect(result).toMatchObject({ focus: 'isolated', hint: 'secret withheld' })
    } finally {
      if (previous === undefined) delete process.env.WORKSHOP_TEST_SECRET
      else process.env.WORKSHOP_TEST_SECRET = previous
      await rm(root, { recursive: true, force: true })
    }
  })
})
