import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { prepareReferenceValidation } from '../src/reference/validate.js'
import { loadLessons } from '../src/core/lessons.js'
import { stateDirectory } from '../src/core/state.js'
import { checkTypeScript } from '../src/verification/typescript-adapter.js'

describe('isolated reference validation', () => {
  it('materializes references outside learner paths and preserves every learner byte', async () => {
    const root = process.cwd()
    const generated = await mkdtemp(path.join(os.tmpdir(), 'reference-validation-'))
    const lessons = await loadLessons(root)
    const before = await Promise.all(
      lessons.map((lesson) => readFile(path.join(lesson.directory, lesson.source), 'utf8')),
    )

    try {
      const prepared = await prepareReferenceValidation(root, generated)
      expect(prepared).toHaveLength(24)
      expect(prepared.every((item) => item.solutionPath.startsWith(generated))).toBe(true)
      const after = await Promise.all(
        lessons.map((lesson) => readFile(path.join(lesson.directory, lesson.source), 'utf8')),
      )
      expect(after).toEqual(before)
    } finally {
      await rm(generated, { recursive: true, force: true })
    }
  })

  it('fails when a generated public test rejects an otherwise valid solution', async () => {
    const root = process.cwd()
    const generated = path.join(
      stateDirectory(root),
      'generated',
      `public-test-discovery-${process.pid}-${Date.now()}`,
    )
    const lesson = (await loadLessons(root)).find(({ id }) => id === '01-linear-scan')!

    try {
      await mkdir(generated, { recursive: true })
      const solutionPath = path.join(generated, 'solution.ts')
      const publicTestPath = path.join(generated, 'public.test.ts')
      await writeFile(
        solutionPath,
        `export function findFirstIndex(values: number[], target: number): number {
  return values.indexOf(target)
}\n`,
        'utf8',
      )
      await writeFile(
        publicTestPath,
        `import { expect, it } from 'vitest'
import { findFirstIndex } from './solution.js'
it('[correctness] deliberately failing generated public test', () => {
  expect(findFirstIndex([1], 1)).toBe(-1)
})\n`,
        'utf8',
      )

      const result = await checkTypeScript(root, lesson, {
        solutionPath,
        publicTestPath,
        skipTypecheck: true,
        verificationOutputDirectory: path.join(generated, 'results'),
      })

      expect(result.passed).toBe(false)
      expect(result.failures.map(({ summary }) => summary)).toContain(
        'deliberately failing generated public test',
      )
    } finally {
      await rm(generated, { recursive: true, force: true })
    }
  })
})
