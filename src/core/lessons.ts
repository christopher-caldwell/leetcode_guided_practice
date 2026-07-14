import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { LessonManifestSchema, type LessonManifest } from './models.js'

export async function loadLessons(root: string): Promise<LessonManifest[]> {
  const lessonsRoot = path.join(root, 'lessons')
  const entries = await readdir(lessonsRoot, { withFileTypes: true })
  const lessons: LessonManifest[] = []

  for (const entry of entries) {
    if (!entry.isDirectory() || !/^\d{2}-/.test(entry.name)) continue
    const directory = path.join(lessonsRoot, entry.name)
    const raw = JSON.parse(await readFile(path.join(directory, 'lesson.json'), 'utf8')) as unknown
    const manifest = LessonManifestSchema.parse(raw)
    if (manifest.id !== entry.name) {
      throw new Error(`Lesson directory ${entry.name} does not match manifest id ${manifest.id}`)
    }
    lessons.push({ ...manifest, directory })
  }

  lessons.sort((left, right) => left.order - right.order)
  lessons.forEach((lesson, index) => {
    if (lesson.order !== index + 1) {
      throw new Error(`Expected lesson order ${index + 1}, received ${lesson.order} (${lesson.id})`)
    }
  })

  return lessons
}

export function currentLesson(
  lessons: LessonManifest[],
  passedAtById: Record<string, string | null>,
): LessonManifest | null {
  return lessons.find((lesson) => !passedAtById[lesson.id]) ?? null
}
