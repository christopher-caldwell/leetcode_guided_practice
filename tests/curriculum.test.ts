import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { validateAnalysis } from '../src/core/analysis.js'
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
      const [instructions, analysis, source, publicTest] = await Promise.all([
        readFile(path.join(lesson.directory, 'instructions.md'), 'utf8'),
        readFile(path.join(lesson.directory, 'analysis.md'), 'utf8'),
        readFile(path.join(lesson.directory, lesson.source), 'utf8'),
        readFile(path.join(lesson.directory, lesson.publicTest), 'utf8'),
      ])
      expect(instructions).toContain(lesson.title)
      expect(instructions).toContain(lesson.source)
      expect(analysis).toContain(`# Analysis: ${lesson.title}`)
      for (const functionName of lesson.functionNames) {
        expect(source).toContain(functionName)
        expect(publicTest).toContain(functionName)
      }
      expect(lesson.hints).toHaveLength(3)
    }
  })

  it('recognizes incomplete concise analysis independently from code verification', async () => {
    const first = (await loadLessons(root))[0]!
    const failures = await validateAnalysis(first)
    expect(new Set(failures.map((failure) => failure.category))).toEqual(new Set(['analysis']))
    expect(failures.at(-1)?.summary).toContain('Correctness and complexity')
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
