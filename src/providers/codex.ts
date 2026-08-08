import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z, type ZodType } from 'zod'
import { runProcess } from '../core/process.js'
import { stateDirectory } from '../core/state.js'
import {
  AnalysisAssessmentResponseSchema,
  DiagnosisResponseSchema,
  HintResponseSchema,
  ReviewResponseSchema,
  type AnalysisAssessmentResponse,
  type AnalysisEvaluator,
  type CoachContext,
  type CoachProvider,
  type DiagnosisResponse,
  type HintResponse,
  type ReviewResponse,
} from './coach.js'
import {
  analysisAssessmentInstruction,
  buildAnalysisAssessmentPrompt,
  buildCoachPrompt,
  diagnosisInstruction,
  hintInstruction,
  reviewInstruction,
} from './prompts.js'

type Operation = 'analysis-assessment' | 'hint' | 'diagnose' | 'review'

export class CodexCoachProvider implements CoachProvider, AnalysisEvaluator {
  readonly name = 'codex'

  constructor(
    private readonly root: string,
    private readonly executable = 'codex',
  ) {}

  async assessAnalysis(context: CoachContext): Promise<AnalysisAssessmentResponse> {
    return this.execute(
      'analysis-assessment',
      AnalysisAssessmentResponseSchema,
      context,
      analysisAssessmentInstruction(),
    )
  }

  async hint(context: CoachContext): Promise<HintResponse> {
    return this.execute('hint', HintResponseSchema, context, hintInstruction(context.hintsUsed))
  }

  async diagnose(context: CoachContext): Promise<DiagnosisResponse> {
    return this.execute(
      'diagnose',
      DiagnosisResponseSchema,
      context,
      diagnosisInstruction(context.attempts),
    )
  }

  async review(context: CoachContext): Promise<ReviewResponse> {
    return this.execute('review', ReviewResponseSchema, context, reviewInstruction())
  }

  private async execute<T>(
    operation: Operation,
    schema: ZodType<T>,
    context: CoachContext,
    instruction: string,
  ): Promise<T> {
    const generated = path.join(stateDirectory(this.root), 'generated', operation)
    await mkdir(generated, { recursive: true })
    const nonce = `${context.lesson.id}-${Date.now()}`
    const schemaPath = path.join(generated, `${nonce}.schema.json`)
    const outputPath = path.join(generated, `${nonce}.output.json`)
    const sandboxPath = path.join(stateDirectory(this.root), 'generated', 'coach-sandbox')
    await mkdir(sandboxPath, { recursive: true })
    await writeFile(schemaPath, `${JSON.stringify(z.toJSONSchema(schema), null, 2)}\n`, 'utf8')

    const prompt =
      operation === 'analysis-assessment'
        ? buildAnalysisAssessmentPrompt(context, instruction)
        : buildCoachPrompt(context, instruction)
    await runCodex(sandboxPath, this.executable, schemaPath, outputPath, prompt)
    return parseCoachResponse(schema, await readFile(outputPath, 'utf8'))
  }
}

export function parseCoachResponse<T>(schema: ZodType<T>, raw: string): T {
  return schema.parse(JSON.parse(raw) as unknown)
}

export async function runCodex(
  sandboxPath: string,
  executable: string,
  schemaPath: string,
  outputPath: string,
  prompt: string,
  options: { ignoreUserConfig?: boolean } = {},
): Promise<void> {
  const args = [
    'exec',
    '--ephemeral',
    ...(options.ignoreUserConfig ? ['--ignore-user-config', '--ignore-rules'] : []),
    '--sandbox',
    'read-only',
    '--skip-git-repo-check',
    '--output-schema',
    schemaPath,
    '--output-last-message',
    outputPath,
    '--cd',
    sandboxPath,
    '-',
  ]

  let lastError: Error | null = null
  for (const candidate of codexExecutableCandidates(executable)) {
    let result: Awaited<ReturnType<typeof runProcess>>
    try {
      result = await runProcess(candidate, args, {
        cwd: sandboxPath,
        environment: coachEnvironment(process.env),
        input: prompt,
        timeoutMs: 120_000,
        killGraceMs: 2_000,
        outputLimit: 8_000,
      })
    } catch (error) {
      lastError = new Error(
        `${candidate} could not start. ${error instanceof Error ? error.message : String(error)}`,
      )
      continue
    }
    if (result.exitCode === 0) return
    lastError = new Error(
      result.timedOut
        ? `${candidate} timed out after 120 seconds.`
        : result.signal
          ? `${candidate} was interrupted (${result.signal}).`
          : `${candidate} exited with code ${result.exitCode}. ${result.stderr.trim()}`,
    )
  }
  throw lastError ?? new Error('No Codex executable was available.')
}

const MACOS_BUNDLED_CODEX = '/Applications/ChatGPT.app/Contents/Resources/codex'

export function codexExecutableCandidates(executable: string): string[] {
  if (executable !== 'codex' || !existsSync(MACOS_BUNDLED_CODEX)) return [executable]
  return [executable, MACOS_BUNDLED_CODEX]
}

const COACH_ENVIRONMENT_KEYS = [
  'PATH',
  'HOME',
  'CODEX_HOME',
  'XDG_CONFIG_HOME',
  'XDG_DATA_HOME',
  'XDG_CACHE_HOME',
  'TMPDIR',
  'TMP',
  'TEMP',
  'USER',
  'LOGNAME',
  'SHELL',
  'LANG',
  'LC_ALL',
  'LC_CTYPE',
  'TERM',
  'COLORTERM',
  'NO_COLOR',
  'HTTPS_PROXY',
  'HTTP_PROXY',
  'ALL_PROXY',
  'NO_PROXY',
  'SSL_CERT_FILE',
  'SSL_CERT_DIR',
] as const

export function coachEnvironment(environment: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const allowed: NodeJS.ProcessEnv = {}
  for (const key of COACH_ENVIRONMENT_KEYS) {
    const value = environment[key]
    if (value !== undefined) allowed[key] = value
  }
  return allowed
}
