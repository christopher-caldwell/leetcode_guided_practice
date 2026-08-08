import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { ensureLearnerFiles, starterSourcePath } from '../src/core/learner-files.js'
import type { LessonManifest } from '../src/core/models.js'

const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  )
})

describe('learner file bootstrap', () => {
  it('copies tracked starters into adjacent learner files', async () => {
    const { lesson, sourceStarter, sourceLearner, analysisLearner } = await createLesson()

    const result = await ensureLearnerFiles([lesson])

    expect(result.created).toEqual([sourceLearner, analysisLearner])
    expect(result.preserved).toEqual([])
    expect(await readFile(sourceLearner, 'utf8')).toBe(await readFile(sourceStarter, 'utf8'))
    expect(await readFile(analysisLearner, 'utf8')).toBe('analysis starter\n')
  })

  it('never overwrites existing learner work', async () => {
    const { lesson, sourceLearner, analysisLearner } = await createLesson()
    await writeFile(sourceLearner, 'my solution\n', 'utf8')
    await writeFile(analysisLearner, 'my reasoning\n', 'utf8')

    const result = await ensureLearnerFiles([lesson])

    expect(result.created).toEqual([])
    expect(result.preserved).toEqual([sourceLearner, analysisLearner])
    expect(await readFile(sourceLearner, 'utf8')).toBe('my solution\n')
    expect(await readFile(analysisLearner, 'utf8')).toBe('my reasoning\n')
  })

  it('derives a tracked starter beside the learner source', async () => {
    const { lesson, sourceStarter } = await createLesson()
    expect(starterSourcePath(lesson)).toBe(sourceStarter)
  })
})

async function createLesson(): Promise<{
  lesson: LessonManifest
  sourceStarter: string
  sourceLearner: string
  analysisLearner: string
}> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'learner-files-'))
  temporaryRoots.push(root)
  const directory = path.join(root, 'lessons', '01-example')
  const solutionDirectory = path.join(directory, 'solutions', 'typescript')
  const sourceStarter = path.join(solutionDirectory, 'solution.ts')
  const sourceLearner = path.join(solutionDirectory, 'learner_solution.ts')
  const analysisLearner = path.join(directory, 'learner_analysis.md')
  await mkdir(solutionDirectory, { recursive: true })
  await writeFile(sourceStarter, 'source starter\n', 'utf8')
  await writeFile(path.join(directory, 'analysis.md'), 'analysis starter\n', 'utf8')

  return {
    lesson: {
      version: 1,
      id: '01-example',
      order: 1,
      title: 'Example',
      kind: 'lesson',
      difficulty: 'foundation',
      skills: ['testing'],
      prerequisite: 'None',
      functionNames: ['example'],
      source: 'solutions/typescript/learner_solution.ts',
      publicTest: 'solutions/typescript/public.test.ts',
      recommendedMinutes: 10,
      hints: ['one', 'two', 'three'],
      reviewOf: [],
      directory,
    },
    sourceStarter,
    sourceLearner,
    analysisLearner,
  }
}
