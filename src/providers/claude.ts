import { mkdir, writeFile } from 'node:fs/promises'
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
import { coachEnvironment } from './codex.js'
import {
  analysisAssessmentInstruction,
  buildAnalysisAssessmentPrompt,
  buildCoachPrompt,
  diagnosisInstruction,
  hintInstruction,
  reviewInstruction,
} from './prompts.js'

type Operation = 'analysis-assessment' | 'hint' | 'diagnose' | 'review'

/** Experimental adapter for the evolving Claude Code non-interactive CLI. */
export class ClaudeCoachProvider implements CoachProvider, AnalysisEvaluator {
  readonly name = 'claude (experimental)'

  constructor(
    private readonly root: string,
    private readonly executable = 'claude',
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
    const sandbox = path.join(stateDirectory(this.root), 'generated', 'coach-sandbox')
    await Promise.all([mkdir(generated, { recursive: true }), mkdir(sandbox, { recursive: true })])

    const nonce = `${context.lesson.id}-${Date.now()}`
    const schemaJson = JSON.stringify(z.toJSONSchema(schema))
    const prompt =
      operation === 'analysis-assessment'
        ? buildAnalysisAssessmentPrompt(context, instruction)
        : buildCoachPrompt(context, instruction)
    const raw = await runClaude(sandbox, this.executable, schemaJson, prompt)
    await writeFile(path.join(generated, `${nonce}.output.json`), raw, 'utf8')
    return parseClaudeResponse(schema, raw)
  }
}

export function parseClaudeResponse<T>(schema: ZodType<T>, raw: string): T {
  const envelope = JSON.parse(raw) as unknown
  const record = isRecord(envelope) ? envelope : null
  let candidate: unknown =
    record?.structured_output ?? record?.structuredOutput ?? record?.result ?? envelope
  if (typeof candidate === 'string') candidate = JSON.parse(candidate) as unknown
  return schema.parse(candidate)
}

export async function runClaude(
  sandboxPath: string,
  executable: string,
  schemaJson: string,
  prompt: string,
): Promise<string> {
  const result = await runProcess(
    executable,
    [
      '--print',
      '--output-format',
      'json',
      '--json-schema',
      schemaJson,
      '--no-session-persistence',
      '--permission-mode',
      'plan',
      '--tools',
      '',
      '--disable-slash-commands',
      '--no-chrome',
      '--strict-mcp-config',
      '--mcp-config',
      '{"mcpServers":{}}',
    ],
    {
      cwd: sandboxPath,
      environment: coachEnvironment(process.env),
      input: prompt,
      timeoutMs: 120_000,
      killGraceMs: 2_000,
      outputLimit: 16_000,
    },
  )
  if (result.exitCode === 0) return result.stdout
  throw new Error(
    result.timedOut
      ? `${executable} timed out after 120 seconds.`
      : result.signal
        ? `${executable} was interrupted (${result.signal}).`
        : `${executable} exited with code ${result.exitCode}. ${result.stderr.trim()}`,
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
