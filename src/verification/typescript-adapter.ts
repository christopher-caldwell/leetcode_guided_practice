import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { CheckFailure, CheckResult, FailureCategory, LessonManifest } from '../core/models.js'
import { runProcess } from '../core/process.js'
import { stateDirectory } from '../core/state.js'
import { validateSourcePolicies } from './source-policies.js'

const TYPECHECK_TIMEOUT_MS = 30_000
const VERIFIER_TIMEOUT_MS = 30_000

export interface TypeScriptCheckOptions {
  solutionPath?: string
  publicTestPath?: string
  skipTypecheck?: boolean
  verificationOutputDirectory?: string
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

export async function checkTypeScript(
  root: string,
  lesson: LessonManifest,
  options: TypeScriptCheckOptions = {},
): Promise<CheckResult> {
  if (!options.skipTypecheck) {
    const typecheck = await runProcess('pnpm', ['exec', 'tsc', '--noEmit'], {
      cwd: root,
      environment: process.env,
      timeoutMs: TYPECHECK_TIMEOUT_MS,
    })
    if (typecheck.timedOut) {
      return timeoutFailure('TypeScript type-check', TYPECHECK_TIMEOUT_MS, typecheck)
    }
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
  }

  const solutionPath = options.solutionPath ?? path.join(lesson.directory, lesson.source)
  const sourceFailures = await validateSourcePolicies(lesson, solutionPath)
  if (sourceFailures.length > 0) {
    return { passed: false, failures: sourceFailures, output: '' }
  }

  const generated =
    options.verificationOutputDirectory ??
    path.join(stateDirectory(root), 'generated', 'verification')
  await mkdir(generated, { recursive: true })
  const outputFile = path.join(generated, `${lesson.id}-${Date.now()}.json`)
  const publicTest = path.relative(
    root,
    options.publicTestPath ?? path.join(lesson.directory, lesson.publicTest),
  )
  const internalTest = 'src/verification/lesson-verifier.test.ts'
  const vitest = await runProcess(
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
    {
      cwd: root,
      environment: {
        ...process.env,
        WORKSHOP_LESSON_ID: lesson.id,
        WORKSHOP_SOLUTION_PATH: solutionPath,
      },
      timeoutMs: VERIFIER_TIMEOUT_MS,
    },
  )

  if (vitest.timedOut) {
    return timeoutFailure('Lesson verifier', VERIFIER_TIMEOUT_MS, vitest)
  }

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

function timeoutFailure(
  label: string,
  timeoutMs: number,
  result: { stdout: string; stderr: string },
): CheckResult {
  const details = trimEvidence(`${result.stdout}\n${result.stderr}`)
  const evidence = `${label} exceeded ${Math.round(timeoutMs / 1_000)} seconds and was terminated.`
  return {
    passed: false,
    failures: [
      {
        category: 'runtime',
        summary: `${label} timed out.`,
        evidence: details ? `${evidence}\n${details}` : evidence,
      },
    ],
    output: `${result.stdout}\n${result.stderr}`,
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
