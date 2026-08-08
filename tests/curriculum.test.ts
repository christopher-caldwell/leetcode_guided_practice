import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { LEARNER_ANALYSIS, starterSourcePath } from '../src/core/learner-files.js'
import { loadLessons } from '../src/core/lessons.js'

const root = process.cwd()

describe('curriculum integrity', () => {
  it('loads an exact progressive sequence of 24 lessons', async () => {
    const lessons = await loadLessons(root)
    expect(lessons).toHaveLength(24)
    expect(lessons.map((lesson) => lesson.order)).toEqual(
      Array.from({ length: 24 }, (_, index) => index + 1),
    )
    expect(
      lessons.filter((lesson) => lesson.kind === 'checkpoint').map((lesson) => lesson.order),
    ).toEqual([6, 11, 16, 21])
    expect(lessons.at(-1)?.kind).toBe('final')
  })

  it('keeps every document, source, visible test, and three-hint ladder consistent', async () => {
    const lessons = await loadLessons(root)
    for (const lesson of lessons) {
      const [instructions, analysisStarter, analysis, sourceStarter, source, publicTest] =
        await Promise.all([
          readFile(path.join(lesson.directory, 'instructions.md'), 'utf8'),
          readFile(path.join(lesson.directory, 'analysis.md'), 'utf8'),
          readFile(path.join(lesson.directory, LEARNER_ANALYSIS), 'utf8'),
          readFile(starterSourcePath(lesson), 'utf8'),
          readFile(path.join(lesson.directory, lesson.source), 'utf8'),
          readFile(path.join(lesson.directory, lesson.publicTest), 'utf8'),
        ])
      expect(instructions).toContain(lesson.title)
      expect(instructions).toContain(lesson.source)
      expect(analysisStarter.trim().length).toBeGreaterThan(0)
      expect(analysisStarter).toContain('TODO:')
      expect(analysis.trim().length).toBeGreaterThan(0)
      for (const functionName of lesson.functionNames) {
        expect(sourceStarter).toContain(functionName)
        expect(source).toContain(functionName)
        expect(publicTest).toContain(functionName)
      }
      expect(sourceStarter).toContain('TODO:')
      expect(publicTest).toContain("'./learner_solution.js'")
      expect(lesson.source).toMatch(/\/learner_[^/]+$/)
      expect(lesson.hints).toHaveLength(3)
    }
  })

  it('packages one integrity-checked reference per lesson', async () => {
    const schema = z.object({
      version: z.literal(1),
      lessons: z.record(
        z.string(),
        z.object({ encoding: z.literal('base64'), sha256: z.string(), content: z.string() }),
      ),
    })
    const bundle = schema.parse(
      JSON.parse(
        await readFile(path.join(root, 'assets/reference-solutions.json'), 'utf8'),
      ) as unknown,
    )
    const lessons = await loadLessons(root)
    expect(Object.keys(bundle.lessons).sort()).toEqual(lessons.map((lesson) => lesson.id).sort())
    for (const entry of Object.values(bundle.lessons)) {
      const decoded = Buffer.from(entry.content, 'base64').toString('utf8')
      expect(createHash('sha256').update(decoded).digest('hex')).toBe(entry.sha256)
      expect(decoded).not.toContain('TODO:')
    }
  })
})
