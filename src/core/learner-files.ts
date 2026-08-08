import { constants } from 'node:fs'
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import type { LessonManifest } from './models.js'

export const ANALYSIS_STARTER = 'analysis.md'
export const LEARNER_ANALYSIS = 'learner_analysis.md'

export interface LearnerFileBootstrapResult {
  created: string[]
  preserved: string[]
}

export function starterSourcePath(lesson: LessonManifest): string {
  const parsed = path.parse(lesson.source)
  if (!parsed.name.startsWith('learner_')) {
    throw new Error(`Lesson ${lesson.id} source must start with learner_: ${lesson.source}`)
  }
  return path.join(
    lesson.directory,
    parsed.dir,
    `${parsed.name.slice('learner_'.length)}${parsed.ext}`,
  )
}

export async function ensureLearnerFiles(
  lessons: LessonManifest[],
): Promise<LearnerFileBootstrapResult> {
  const result: LearnerFileBootstrapResult = { created: [], preserved: [] }

  for (const lesson of lessons) {
    await copyIfMissing(
      starterSourcePath(lesson),
      path.join(lesson.directory, lesson.source),
      result,
    )
    await copyIfMissing(
      path.join(lesson.directory, ANALYSIS_STARTER),
      path.join(lesson.directory, LEARNER_ANALYSIS),
      result,
    )
  }

  return result
}

async function copyIfMissing(
  starter: string,
  learner: string,
  result: LearnerFileBootstrapResult,
): Promise<void> {
  try {
    await copyFile(starter, learner, constants.COPYFILE_EXCL)
    result.created.push(learner)
  } catch (error) {
    if (isAlreadyPresent(error)) {
      result.preserved.push(learner)
      return
    }
    throw error
  }
}

function isAlreadyPresent(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST'
}
