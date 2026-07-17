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
import { preparePracticeWorkspace } from '../src/practice/workspace.js'

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
})
