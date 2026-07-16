import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { prepareReferenceValidation } from '../scripts/validate-references.js'
import { loadLessons } from '../src/core/lessons.js'

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
})
