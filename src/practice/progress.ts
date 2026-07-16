import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { stateDirectory } from '../core/state.js'

const PracticeProgressEntrySchema = z.object({
  attempts: z.number().int().nonnegative().default(0),
  lastAttemptedAt: z.string().datetime().nullable().default(null),
  completedAt: z.string().datetime().nullable().default(null),
  confidence: z.number().int().min(1).max(5).nullable().default(null),
})

const PracticeProgressSchema = z.object({
  version: z.literal(1),
  problems: z.record(z.string(), PracticeProgressEntrySchema),
})

export type PracticeProgress = z.infer<typeof PracticeProgressSchema>

function progressPath(root: string): string {
  return path.join(stateDirectory(root), 'practice-progress.json')
}

export async function loadPracticeProgress(root: string): Promise<PracticeProgress> {
  try {
    return PracticeProgressSchema.parse(
      JSON.parse(await readFile(progressPath(root), 'utf8')) as unknown,
    )
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    return { version: 1, problems: {} }
  }
}

export async function savePracticeProgress(
  root: string,
  progress: PracticeProgress,
): Promise<void> {
  const directory = stateDirectory(root)
  await mkdir(directory, { recursive: true })
  const target = progressPath(root)
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(progress, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

export function recordPracticeAttempt(
  progress: PracticeProgress,
  problemId: string,
  now = new Date(),
): void {
  const entry = (progress.problems[problemId] ??= PracticeProgressEntrySchema.parse({}))
  entry.attempts += 1
  entry.lastAttemptedAt = now.toISOString()
}

export function recordPracticeCompletion(
  progress: PracticeProgress,
  problemId: string,
  confidence: number,
  now = new Date(),
): void {
  const entry = (progress.problems[problemId] ??= PracticeProgressEntrySchema.parse({}))
  entry.completedAt = now.toISOString()
  entry.confidence = confidence
}
