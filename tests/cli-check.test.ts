import { chmod, mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { runProcess } from '../src/core/process.js'

const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  )
})

describe('check command result semantics', () => {
  it('advances when code verification and the Codex analysis assessment pass', async () => {
    const root = await createWorkshopRoot({
      passed: true,
      feedback: 'No notes—this is excellent.',
    })

    const result = await runCheck(root)

    expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0)
    expect(result.stdout).toContain('PASS —')
    expect(result.stdout).toContain('ANALYSIS PASS')
    expect(result.stdout).toContain('No notes—this is excellent.')
    expect(result.stdout).toContain('ADVANCED')
  }, 35_000)

  it('returns failure and actionable feedback when Codex rejects the analysis', async () => {
    const root = await createWorkshopRoot({
      passed: false,
      feedback: 'The scan is identified, but explain why it returns the first match.',
    })

    const result = await runCheck(root)

    expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(1)
    expect(result.stdout).toContain('PASS —')
    expect(result.stdout).toContain('ANALYSIS FAIL')
    expect(result.stdout).toContain(
      'The scan is identified, but explain why it returns the first match.',
    )
    expect(result.stdout).not.toContain('ADVANCED')
  }, 35_000)

  it('advances on deterministic checks alone when AI feedback is disabled', async () => {
    const root = await createWorkshopRoot({
      passed: false,
      feedback: 'This response should never be requested.',
    })

    const result = await runCheck(root, '')

    expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0)
    expect(result.stdout).toContain('PASS —')
    expect(result.stdout).toContain('reasoning remains self-assessed')
    expect(result.stdout).toContain('ADVANCED')
    expect(result.stdout).not.toContain('ANALYSIS FAIL')
  }, 35_000)
})

async function createWorkshopRoot(assessment: {
  passed: boolean
  feedback: string
}): Promise<string> {
  const repository = process.cwd()
  const root = await mkdtemp(path.join(os.tmpdir(), 'workshop-check-'))
  temporaryRoots.push(root)

  const bin = path.join(root, 'bin')
  const lesson = path.join(root, 'lessons', '01-linear-scan')
  const solutionDirectory = path.join(lesson, 'solutions', 'typescript')
  await Promise.all([mkdir(bin), mkdir(solutionDirectory, { recursive: true })])
  await Promise.all([
    symlink(path.join(repository, 'node_modules'), path.join(root, 'node_modules')),
    symlink(path.join(repository, 'src'), path.join(root, 'src')),
    writeFile(path.join(root, 'package.json'), `${JSON.stringify({ type: 'module' })}\n`, 'utf8'),
    writeFile(
      path.join(root, 'tsconfig.json'),
      `${JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: ['node', 'vitest/globals'],
        },
        include: ['lessons/**/*.ts'],
      })}\n`,
      'utf8',
    ),
    writeFile(
      path.join(lesson, 'lesson.json'),
      `${JSON.stringify({
        version: 1,
        id: '01-linear-scan',
        order: 1,
        title: 'Find the First Matching Record',
        kind: 'lesson',
        difficulty: 'foundation',
        skills: ['linear scans'],
        prerequisite: 'TypeScript loops',
        functionNames: ['findFirstIndex'],
        source: 'solutions/typescript/learner_solution.ts',
        publicTest: 'solutions/typescript/public.test.ts',
        recommendedMinutes: 15,
        hints: ['one', 'two', 'three'],
        reviewOf: [],
      })}\n`,
      'utf8',
    ),
    writeFile(
      path.join(lesson, 'learner_analysis.md'),
      '# Analysis\n\nI scan from left to right and return the first match. The scan is O(n) time and O(1) space.\n',
      'utf8',
    ),
    writeFile(
      path.join(lesson, 'instructions.md'),
      '# Find the First Matching Record\n\nReturn the first matching index without mutating input.\n',
      'utf8',
    ),
    writeFile(
      path.join(solutionDirectory, 'learner_solution.ts'),
      'export function findFirstIndex(values: number[], target: number): number {\n  return values.findIndex((value) => value === target)\n}\n',
      'utf8',
    ),
    writeFile(
      path.join(solutionDirectory, 'public.test.ts'),
      "import { expect, it } from 'vitest'\nimport { findFirstIndex } from './learner_solution.js'\nit('finds the first match', () => expect(findFirstIndex([2, 2], 2)).toBe(0))\n",
      'utf8',
    ),
    writeFile(
      path.join(bin, 'codex'),
      `#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
const output = args[args.indexOf('--output-last-message') + 1]
let prompt = ''
for await (const chunk of process.stdin) prompt += chunk
const receivedOnlyAssessmentInputs =
  prompt.includes('I scan from left to right') &&
  prompt.includes('export function findFirstIndex') &&
  !prompt.includes('Attempt count:')
const response = receivedOnlyAssessmentInputs
  ? ${JSON.stringify(assessment)}
  : { passed: false, feedback: 'Unexpected assessment prompt contents.' }
writeFileSync(output, JSON.stringify(response))
`,
      'utf8',
    ),
  ])
  await chmod(path.join(bin, 'codex'), 0o755)
  return root
}

async function runCheck(root: string, provider = 'codex') {
  const repository = process.cwd()
  return runProcess(
    process.execPath,
    ['--import', 'tsx', path.join(repository, 'src', 'cli', 'index.ts'), 'check'],
    {
      cwd: root,
      environment: {
        ...process.env,
        PATH: `${path.join(root, 'bin')}:${process.env.PATH ?? ''}`,
        COACH_PROVIDER: provider,
        WORKSHOP_TIMER_MODE: 'off',
        NO_COLOR: '1',
      },
      timeoutMs: 30_000,
    },
  )
}
