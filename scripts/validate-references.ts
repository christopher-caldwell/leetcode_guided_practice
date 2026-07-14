import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const EntrySchema = z.object({
  encoding: z.literal('base64'),
  sha256: z.string(),
  content: z.string(),
})

const BundleSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), EntrySchema),
})

const root = process.cwd()
const bundle = BundleSchema.parse(
  JSON.parse(
    await readFile(path.join(root, 'assets', 'reference-solutions.json'), 'utf8'),
  ) as unknown,
)
const lessonIds = (await readdir(path.join(root, 'lessons'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort()

const backups = new Map<string, string>()
let failure: Error | null = null

try {
  for (const id of lessonIds) {
    const target = path.join(root, 'lessons', id, 'solutions', 'typescript', 'solution.ts')
    backups.set(target, await readFile(target, 'utf8'))
    const entry = bundle.lessons[id]
    if (!entry) throw new Error(`Reference bundle is missing ${id}`)
    const content = Buffer.from(entry.content, 'base64').toString('utf8')
    const digest = createHash('sha256').update(content).digest('hex')
    if (digest !== entry.sha256) throw new Error(`Reference integrity failed for ${id}`)
    await writeFile(target, content, 'utf8')
  }

  run('pnpm', ['exec', 'tsc', '--noEmit'])
  for (const id of lessonIds) {
    const publicTest = `lessons/${id}/solutions/typescript/public.test.ts`
    run('pnpm', ['exec', 'vitest', 'run', publicTest, 'src/verification/lesson-verifier.test.ts'], {
      WORKSHOP_LESSON_ID: id,
    })
    process.stdout.write(`validated ${id}\n`)
  }
} catch (error) {
  failure = error instanceof Error ? error : new Error(String(error))
} finally {
  for (const [target, content] of backups) await writeFile(target, content, 'utf8')
}

if (failure) throw failure

function run(command: string, args: string[], extraEnvironment: Record<string, string> = {}): void {
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...extraEnvironment },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${result.stdout ?? ''}\n${result.stderr ?? ''}`,
    )
  }
}
