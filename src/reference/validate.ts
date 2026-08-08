import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { z } from 'zod'
import { loadLessons } from '../core/lessons.js'
import { runProcess } from '../core/process.js'
import { stateDirectory } from '../core/state.js'
import { checkTypeScript } from '../verification/typescript-adapter.js'

const EntrySchema = z.object({
  encoding: z.literal('base64'),
  sha256: z.string(),
  content: z.string(),
})

const BundleSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), EntrySchema),
})

export interface PreparedReference {
  lessonId: string
  solutionPath: string
  publicTestPath: string
}

export async function prepareReferenceValidation(
  root: string,
  generatedRoot: string,
): Promise<PreparedReference[]> {
  const lessons = await loadLessons(root)
  const bundle = BundleSchema.parse(
    JSON.parse(
      await readFile(path.join(root, 'lessons', 'reference-solutions.json'), 'utf8'),
    ) as unknown,
  )
  const prepared: PreparedReference[] = []

  await mkdir(generatedRoot, { recursive: true })
  for (const lesson of lessons) {
    const entry = bundle.lessons[lesson.id]
    if (!entry) throw new Error(`Reference bundle is missing ${lesson.id}`)
    const content = Buffer.from(entry.content, 'base64').toString('utf8')
    const digest = createHash('sha256').update(content).digest('hex')
    if (digest !== entry.sha256) throw new Error(`Reference integrity failed for ${lesson.id}`)

    const lessonRoot = path.join(generatedRoot, lesson.id)
    const solutionPath = path.join(lessonRoot, path.basename(lesson.source))
    const publicTestPath = path.join(lessonRoot, 'public.test.ts')
    await mkdir(lessonRoot, { recursive: true })
    await writeFile(solutionPath, content, 'utf8')
    await writeFile(
      publicTestPath,
      await readFile(path.join(lesson.directory, lesson.publicTest), 'utf8'),
      'utf8',
    )

    const supportPath = path.join(lesson.directory, path.dirname(lesson.source), 'support.ts')
    const support = await readOptionalFile(supportPath)
    if (support !== null) await writeFile(path.join(lessonRoot, 'support.ts'), support, 'utf8')

    prepared.push({ lessonId: lesson.id, solutionPath, publicTestPath })
  }

  await writeFile(
    path.join(generatedRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        extends: path.relative(generatedRoot, path.join(root, 'tsconfig.json')),
        compilerOptions: { noEmit: true },
        include: ['./**/*.ts'],
        exclude: [],
      },
      null,
      2,
    )}\n`,
    'utf8',
  )
  return prepared
}

export async function validateReferences(root: string): Promise<void> {
  const generatedRoot = path.join(
    stateDirectory(root),
    'generated',
    `reference-validation-${process.pid}-${Date.now()}`,
  )
  try {
    const prepared = await prepareReferenceValidation(root, generatedRoot)
    const typecheck = await runProcess(
      'pnpm',
      ['exec', 'tsc', '--noEmit', '--project', path.join(generatedRoot, 'tsconfig.json')],
      {
        cwd: root,
        environment: process.env,
        timeoutMs: 30_000,
      },
    )
    if (typecheck.timedOut) throw new Error('Reference type-check timed out after 30 seconds.')
    if (typecheck.exitCode !== 0) {
      throw new Error(`Reference type-check failed\n${typecheck.stdout}\n${typecheck.stderr}`)
    }

    const lessons = await loadLessons(root)
    const byId = new Map(prepared.map((item) => [item.lessonId, item]))
    for (const lesson of lessons) {
      const target = byId.get(lesson.id)
      if (!target) throw new Error(`Prepared reference is missing ${lesson.id}`)
      const result = await checkTypeScript(root, lesson, {
        solutionPath: target.solutionPath,
        publicTestPath: target.publicTestPath,
        skipTypecheck: true,
        verificationOutputDirectory: path.join(generatedRoot, 'results'),
      })
      if (!result.passed) {
        const evidence = result.failures
          .map((failure) => `[${failure.category}] ${failure.summary}\n${failure.evidence}`)
          .join('\n\n')
        throw new Error(`Reference validation failed for ${lesson.id}\n${evidence}`)
      }
      process.stdout.write(`validated ${lesson.id}\n`)
    }
  } finally {
    await rm(generatedRoot, { recursive: true, force: true })
  }
}

async function readOptionalFile(target: string): Promise<string | null> {
  try {
    return await readFile(target, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

const entrypoint = process.argv[1]
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await validateReferences(process.cwd())
}
