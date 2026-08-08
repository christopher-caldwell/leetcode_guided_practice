import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  allPracticeProblems,
  loadPracticeContracts,
  loadPracticeCatalog,
  findPracticeProblem,
} from '../src/practice/catalog.js'
import { runProcess } from '../src/core/process.js'
import type { GeneratedPracticeVariant } from '../src/practice/models.js'
import {
  nextFreshPracticeAttemptNumber,
  prepareFreshPracticeWorkspace,
  preparePracticeWorkspace,
} from '../src/practice/workspace.js'

const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  )
})

describe('supplemental practice workspace', () => {
  it('creates a typed starter once and never overwrites learner work', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'practice-workspace-'))
    temporaryRoots.push(root)
    const catalog = await loadPracticeCatalog(process.cwd())
    const problem = findPracticeProblem(catalog, 'set-01')!
    const contract = 'export function firstBadgeSeenTwice(scans: number[]): number'
    const first = await preparePracticeWorkspace(root, problem, contract)
    expect(first.created).toBe(true)
    expect(await readFile(first.solution, 'utf8')).toContain(contract)

    await writeFile(first.solution, '// learner work\n', 'utf8')
    const second = await preparePracticeWorkspace(root, problem, contract)
    expect(second.created).toBe(false)
    expect(await readFile(second.solution, 'utf8')).toBe('// learner work\n')
  })

  it('generates compiling TypeScript starters for every displayed contract', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'practice-contracts-'))
    temporaryRoots.push(root)
    const [catalog, contracts] = await Promise.all([
      loadPracticeCatalog(process.cwd()),
      loadPracticeContracts(process.cwd()),
    ])
    await writeFile(
      path.join(root, 'tsconfig.json'),
      `${JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
        },
        include: ['./practice/attempts/**/solution.ts'],
      })}\n`,
      'utf8',
    )
    await Promise.all(
      allPracticeProblems(catalog).map((problem) =>
        preparePracticeWorkspace(root, problem, contracts[problem.id]!),
      ),
    )
    const executable = path.join(
      process.cwd(),
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'tsc.cmd' : 'tsc',
    )
    const result = await runProcess(
      executable,
      ['--noEmit', '--project', path.join(root, 'tsconfig.json')],
      { cwd: process.cwd(), environment: process.env, timeoutMs: 30_000 },
    )
    expect(result.timedOut).toBe(false)
    expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0)
  })

  it('creates numbered fresh attempts without overwriting earlier learner work', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'practice-fresh-workspace-'))
    temporaryRoots.push(root)
    const catalog = await loadPracticeCatalog(process.cwd())
    const problem = findPracticeProblem(catalog, 'focus-04')!
    const contract =
      'export function targetPairPositions(readings: number[], target: number): [number, number] | null'
    const firstVariant: GeneratedPracticeVariant = {
      title: 'First Fresh Pair Story',
      statement:
        'Find two distinct telemetry positions whose recorded values combine to the requested calibration total.',
      constraints: ['At least zero readings', 'Values are safe integers', 'Do not mutate readings'],
      examples: [
        { input: '([2, 7, 11], 9)', output: '[0, 1]', explanation: null },
        { input: '([1, 2], 9)', output: 'null', explanation: null },
      ],
    }

    expect(await nextFreshPracticeAttemptNumber(root, problem.id)).toBe(1)
    const first = await prepareFreshPracticeWorkspace(
      root,
      problem,
      contract,
      1,
      firstVariant,
      new Date('2026-08-07T12:00:00.000Z'),
    )
    expect(first.directory).toMatch(/focus-04\/attempt-001$/)
    expect(await readFile(first.prompt, 'utf8')).toContain('First Fresh Pair Story')
    await writeFile(first.solution, '// learner attempt one\n', 'utf8')

    const secondVariant = { ...firstVariant, title: 'Second Fresh Pair Story' }
    expect(await nextFreshPracticeAttemptNumber(root, problem.id)).toBe(2)
    const second = await prepareFreshPracticeWorkspace(
      root,
      problem,
      contract,
      2,
      secondVariant,
      new Date('2026-08-07T13:00:00.000Z'),
    )
    expect(second.directory).toMatch(/focus-04\/attempt-002$/)
    expect(await readFile(first.solution, 'utf8')).toBe('// learner attempt one\n')
    expect(await readFile(second.prompt, 'utf8')).toContain('Second Fresh Pair Story')
    expect(JSON.parse(await readFile(second.variant, 'utf8'))).toMatchObject({
      base_problem_id: 'focus-04',
      attempt_number: 2,
      generator: 'codex',
    })
  })
})
