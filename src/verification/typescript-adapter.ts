import { spawn } from 'node:child_process'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { CheckFailure, CheckResult, FailureCategory, LessonManifest } from '../core/models.js'
import { stateDirectory } from '../core/state.js'

interface ProcessResult {
  exitCode: number
  stdout: string
  stderr: string
}

interface VitestAssertion {
  title?: string
  fullName?: string
  status?: string
  failureMessages?: string[]
}

interface VitestTestResult {
  assertionResults?: VitestAssertion[]
}

interface VitestJsonResult {
  testResults?: VitestTestResult[]
}

export async function checkTypeScript(root: string, lesson: LessonManifest): Promise<CheckResult> {
  const typecheck = await run(root, 'pnpm', ['exec', 'tsc', '--noEmit'])
  if (typecheck.exitCode !== 0) {
    return {
      passed: false,
      failures: [
        {
          category: 'typecheck',
          summary: 'The TypeScript project does not type-check.',
          evidence: trimEvidence(`${typecheck.stdout}\n${typecheck.stderr}`),
        },
      ],
      output: `${typecheck.stdout}\n${typecheck.stderr}`,
    }
  }

  const generated = path.join(stateDirectory(root), 'generated', 'verification')
  await mkdir(generated, { recursive: true })
  const outputFile = path.join(generated, `${lesson.id}-${Date.now()}.json`)
  const publicTest = path.relative(root, path.join(lesson.directory, lesson.publicTest))
  const internalTest = 'src/verification/lesson-verifier.test.ts'
  const vitest = await run(
    root,
    'pnpm',
    [
      'exec',
      'vitest',
      'run',
      publicTest,
      internalTest,
      '--reporter=json',
      `--outputFile=${outputFile}`,
    ],
    { WORKSHOP_LESSON_ID: lesson.id },
  )

  if (vitest.exitCode === 0) {
    return { passed: true, failures: [], output: vitest.stdout }
  }

  let parsed: VitestJsonResult | null = null
  try {
    parsed = JSON.parse(await readFile(outputFile, 'utf8')) as VitestJsonResult
  } catch {
    // A startup or module-loading error can prevent Vitest from producing JSON.
  }

  const failures = extractFailures(parsed)
  if (failures.length === 0) {
    failures.push({
      category: 'runtime',
      summary: 'The verifier could not execute the solution.',
      evidence: trimEvidence(`${vitest.stdout}\n${vitest.stderr}`),
    })
  }

  return {
    passed: false,
    failures: failures.slice(0, 4),
    output: `${vitest.stdout}\n${vitest.stderr}`,
  }
}

function extractFailures(result: VitestJsonResult | null): CheckFailure[] {
  const failures: CheckFailure[] = []
  for (const testResult of result?.testResults ?? []) {
    for (const assertion of testResult.assertionResults ?? []) {
      if (assertion.status !== 'failed') continue
      const title = assertion.fullName ?? assertion.title ?? 'Verifier assertion failed'
      failures.push({
        category: categoryFromTitle(title),
        summary: title.replace(/^.*?\[([a-z-]+)]\s*/i, ''),
        evidence: trimEvidence((assertion.failureMessages ?? []).join('\n')),
      })
    }
  }
  return failures
}

function categoryFromTitle(title: string): FailureCategory {
  const match = /\[(analysis|typecheck|correctness|edge-case|contract|complexity|runtime)]/i.exec(
    title,
  )
  return (match?.[1]?.toLowerCase() as FailureCategory | undefined) ?? 'correctness'
}

function trimEvidence(value: string): string {
  const cleaned = value
    .split('\n')
    .filter((line) => !/^\s+at\s/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return cleaned.length > 900 ? `${cleaned.slice(0, 900)}\n…` : cleaned
}

async function run(
  root: string,
  executable: string,
  args: string[],
  extraEnvironment: Record<string, string> = {},
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: root,
      env: { ...process.env, ...extraEnvironment },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => (stdout += chunk))
    child.stderr.on('data', (chunk: string) => (stderr += chunk))
    child.on('error', reject)
    child.on('close', (code) => resolve({ exitCode: code ?? 1, stdout, stderr }))
  })
}
