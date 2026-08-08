import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { stateDirectory } from '../core/state.js'

const ReferenceEntrySchema = z.object({
  encoding: z.literal('base64'),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  content: z.string().min(1),
})

const ReferenceBundleSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), ReferenceEntrySchema),
})

export async function revealReference(root: string, lessonId: string): Promise<string> {
  const bundle = ReferenceBundleSchema.parse(
    JSON.parse(
      await readFile(path.join(root, 'lessons', 'reference-solutions.json'), 'utf8'),
    ) as unknown,
  )
  const entry = bundle.lessons[lessonId]
  if (!entry) throw new Error(`No packaged reference solution exists for ${lessonId}`)
  const content = Buffer.from(entry.content, 'base64').toString('utf8')
  const actual = createHash('sha256').update(content).digest('hex')
  if (actual !== entry.sha256)
    throw new Error(`Reference solution integrity check failed for ${lessonId}`)

  const directory = path.join(stateDirectory(root), 'revealed', lessonId)
  await mkdir(directory, { recursive: true })
  const target = path.join(directory, 'solution.ts')
  await writeFile(target, content, 'utf8')
  try {
    await copyFile(
      path.join(root, 'lessons', lessonId, 'solutions', 'typescript', 'support.ts'),
      path.join(directory, 'support.ts'),
    )
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  return target
}
