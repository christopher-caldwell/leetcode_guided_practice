import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { stateDirectory } from '../core/state.js'
import { runCodex } from '../providers/codex.js'
import {
  GeneratedPracticeAttemptSchema,
  GeneratedPracticeVariantSchema,
  type GeneratedPracticeVariant,
  type PracticeProblem,
} from './models.js'

export class CodexPracticeGenerator {
  readonly name = 'codex'

  constructor(
    private readonly root: string,
    private readonly executable = 'codex',
  ) {}

  async generate(problem: PracticeProblem, contract: string): Promise<GeneratedPracticeVariant> {
    const generated = path.join(stateDirectory(this.root), 'generated', 'practice-variant')
    const sandbox = path.join(stateDirectory(this.root), 'generated', 'practice-generator-sandbox')
    await Promise.all([mkdir(generated, { recursive: true }), mkdir(sandbox, { recursive: true })])

    const nonce = `${problem.id}-${Date.now()}`
    const schemaPath = path.join(generated, `${nonce}.schema.json`)
    const outputPath = path.join(generated, `${nonce}.output.json`)
    await writeFile(
      schemaPath,
      `${JSON.stringify(z.toJSONSchema(GeneratedPracticeVariantSchema), null, 2)}\n`,
      'utf8',
    )

    const previousVariants = await loadGeneratedPracticeAttempts(this.root, problem.id)
    await runCodex(
      sandbox,
      this.executable,
      schemaPath,
      outputPath,
      buildGenerationPrompt(problem, contract, previousVariants),
      { ignoreUserConfig: true },
    )
    return GeneratedPracticeVariantSchema.parse(
      JSON.parse(await readFile(outputPath, 'utf8')) as unknown,
    )
  }
}

export async function loadGeneratedPracticeAttempts(
  root: string,
  problemId: string,
): Promise<Array<z.infer<typeof GeneratedPracticeAttemptSchema>>> {
  const problemRoot = path.join(root, 'practice', 'attempts', problemId)
  let names: string[]
  try {
    names = await readdir(problemRoot)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }

  const records = await Promise.all(
    names
      .filter((name) => /^attempt-[0-9]{3,}$/.test(name))
      .sort()
      .map(async (name) => {
        try {
          const raw = JSON.parse(
            await readFile(path.join(problemRoot, name, 'variant.json'), 'utf8'),
          ) as unknown
          return GeneratedPracticeAttemptSchema.parse(raw)
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
          throw error
        }
      }),
  )
  return records.filter((record) => record !== null)
}

function buildGenerationPrompt(
  problem: PracticeProblem,
  contract: string,
  previousVariants: Array<z.infer<typeof GeneratedPracticeAttemptSchema>>,
): string {
  const prior = previousVariants.length
    ? previousVariants
        .map(
          (record) =>
            `Attempt ${record.attempt_number}: ${record.variant.title}\n${record.variant.statement}`,
        )
        .join('\n\n')
    : 'None yet.'

  return `You create fresh, self-contained algorithm interview exercises for an experienced TypeScript engineer.

Generate a new presentation of the exact underlying problem described below. Change the domain, nouns, examples, and surface framing substantially, but preserve the required algorithmic insight, input/output shape, edge cases, and target complexity. The new exercise must be solvable with the fixed TypeScript contract exactly as written.

Do not name the canonical LeetCode problem, the algorithm, the data structure, or the pattern in the title or statement. Do not provide hints, pseudocode, solution steps, implementation code, or complexity claims in the generated learner-facing fields. Do not introduce an additional algorithmic technique beyond the base problem. Keep the contract unambiguous and interview-sized.

BASE PROBLEM (trusted catalog metadata)
Title: ${problem.title}
Statement: ${problem.statement}
Primary concept: ${problem.primary_concept}
Secondary concepts: ${problem.secondary_concepts.join(', ')}
Target complexity: ${problem.expected_complexity.time} time; ${problem.expected_complexity.space} space
Important edge cases: ${problem.edge_cases.join('; ')}

FIXED TYPESCRIPT CONTRACT
${contract}

PRIOR GENERATED PRESENTATIONS TO AVOID REPEATING
${prior}

Return only the required structured response. Example inputs and outputs must be strings containing concise TypeScript-like call arguments and returned values that agree with the fixed contract. Every example must include explanation; use null when no explanation is needed.`
}
