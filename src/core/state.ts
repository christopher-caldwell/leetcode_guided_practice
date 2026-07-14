import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  LessonProgressSchema,
  WorkshopStateSchema,
  type LessonManifest,
  type LessonProgress,
  type WorkshopState,
} from './models.js'

export function stateDirectory(root: string): string {
  return path.join(root, '.workshop')
}

function statePath(root: string): string {
  return path.join(stateDirectory(root), 'progress.json')
}

function newLessonProgress(): LessonProgress {
  return LessonProgressSchema.parse({})
}

export async function loadState(root: string, lessons: LessonManifest[]): Promise<WorkshopState> {
  let state: WorkshopState
  try {
    const raw = JSON.parse(await readFile(statePath(root), 'utf8')) as unknown
    state = WorkshopStateSchema.parse(raw)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    state = { version: 1, lessons: {} }
  }

  for (const lesson of lessons) {
    state.lessons[lesson.id] ??= newLessonProgress()
  }
  return state
}

export async function saveState(root: string, state: WorkshopState): Promise<void> {
  const directory = stateDirectory(root)
  await mkdir(directory, { recursive: true })
  const target = statePath(root)
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

export async function resetState(root: string): Promise<void> {
  await rm(stateDirectory(root), { recursive: true, force: true })
}

export function passedAtMap(state: WorkshopState): Record<string, string | null> {
  return Object.fromEntries(
    Object.entries(state.lessons).map(([id, progress]) => [id, progress.passedAt]),
  )
}
