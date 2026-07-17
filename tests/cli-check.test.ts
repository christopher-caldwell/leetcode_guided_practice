import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
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
  it('prints PASS and exits successfully when code passes but notes are incomplete', async () => {
    const repository = process.cwd()
    const root = await mkdtemp(path.join(os.tmpdir(), 'workshop-check-'))
    temporaryRoots.push(root)

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
    ])

    const lesson = path.join(root, 'lessons', '01-linear-scan')
    const solutionDirectory = path.join(lesson, 'solutions', 'typescript')
    await mkdir(solutionDirectory, { recursive: true })
    await Promise.all([
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
          source: 'solutions/typescript/solution.ts',
          publicTest: 'solutions/typescript/public.test.ts',
          recommendedMinutes: 15,
          hints: ['one', 'two', 'three'],
          reviewOf: [],
        })}\n`,
        'utf8',
      ),
      writeFile(
        path.join(lesson, 'analysis.md'),
        '# Analysis\n\n## Contract\n\n<!-- TODO -->\n\n## Approach\n\n<!-- TODO -->\n\n## Correctness and complexity\n\n<!-- TODO -->\n',
        'utf8',
      ),
      writeFile(
        path.join(solutionDirectory, 'solution.ts'),
        'export function findFirstIndex(values: number[], target: number): number {\n  return values.findIndex((value) => value === target)\n}\n',
        'utf8',
      ),
      writeFile(
        path.join(solutionDirectory, 'public.test.ts'),
        "import { expect, it } from 'vitest'\nimport { findFirstIndex } from './solution.js'\nit('finds the first match', () => expect(findFirstIndex([2, 2], 2)).toBe(0))\n",
        'utf8',
      ),
    ])

    const result = await runProcess(
      process.execPath,
      ['--import', 'tsx', path.join(repository, 'src', 'cli', 'index.ts'), 'check'],
      {
        cwd: root,
        environment: {
          ...process.env,
          COACH_PROVIDER: '',
          WORKSHOP_TIMER_MODE: 'off',
          NO_COLOR: '1',
        },
        timeoutMs: 30_000,
      },
    )

    expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0)
    expect(result.stdout).toContain('PASS —')
    expect(result.stdout).toContain('WAITING Tests passed')
    expect(result.stdout).not.toContain('\nFAIL\n')
  }, 35_000)
})
