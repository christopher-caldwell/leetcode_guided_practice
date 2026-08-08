import { access, mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type {
  GeneratedPracticeAttempt,
  GeneratedPracticeVariant,
  PracticeProblem,
} from './models.js'

export interface PracticeWorkspacePaths {
  directory: string
  solution: string
  analysis: string
  tsconfig: string
}

export interface PreparedPracticeWorkspace extends PracticeWorkspacePaths {
  created: boolean
}

export interface FreshPracticeWorkspacePaths extends PracticeWorkspacePaths {
  attemptNumber: number
  prompt: string
  variant: string
}

export function practiceWorkspacePaths(root: string, problemId: string): PracticeWorkspacePaths {
  if (!/^[a-z]+-[0-9]{2}$/.test(problemId)) throw new Error(`Invalid practice id: ${problemId}`)
  const directory = path.join(root, 'practice', 'attempts', problemId)
  return {
    directory,
    solution: path.join(directory, 'solution.ts'),
    analysis: path.join(directory, 'analysis.md'),
    tsconfig: path.join(directory, 'tsconfig.json'),
  }
}

export function freshPracticeWorkspacePaths(
  root: string,
  problemId: string,
  attemptNumber: number,
): FreshPracticeWorkspacePaths {
  if (!/^[a-z]+-[0-9]{2}$/.test(problemId)) throw new Error(`Invalid practice id: ${problemId}`)
  if (!Number.isInteger(attemptNumber) || attemptNumber < 1) {
    throw new Error(`Invalid fresh attempt number: ${attemptNumber}`)
  }
  const directory = path.join(
    root,
    'practice',
    'attempts',
    problemId,
    `attempt-${String(attemptNumber).padStart(3, '0')}`,
  )
  return {
    directory,
    solution: path.join(directory, 'solution.ts'),
    analysis: path.join(directory, 'analysis.md'),
    tsconfig: path.join(directory, 'tsconfig.json'),
    prompt: path.join(directory, 'prompt.md'),
    variant: path.join(directory, 'variant.json'),
    attemptNumber,
  }
}

export async function nextFreshPracticeAttemptNumber(
  root: string,
  problemId: string,
): Promise<number> {
  const problemRoot = path.join(root, 'practice', 'attempts', problemId)
  let names: string[]
  try {
    names = await readdir(problemRoot)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 1
    throw error
  }
  const numbers = names
    .map((name) => /^attempt-([0-9]{3,})$/.exec(name)?.[1])
    .filter((value): value is string => value !== undefined)
    .map(Number)
  return Math.max(0, ...numbers) + 1
}

export async function preparePracticeWorkspace(
  root: string,
  problem: PracticeProblem,
  contract: string,
): Promise<PreparedPracticeWorkspace> {
  const paths = practiceWorkspacePaths(root, problem.id)
  await mkdir(paths.directory, { recursive: true })
  const writes = await Promise.all([
    writeIfMissing(paths.solution, starterSolution(problem.id, problem.title, contract)),
    writeIfMissing(paths.analysis, starterAnalysis(problem.title)),
    writeIfMissing(
      paths.tsconfig,
      `${JSON.stringify(
        {
          extends: '../../../tsconfig.json',
          compilerOptions: { noEmit: true },
          include: ['./solution.ts'],
          exclude: [],
        },
        null,
        2,
      )}\n`,
    ),
  ])
  return { ...paths, created: writes.some(Boolean) }
}

export async function prepareFreshPracticeWorkspace(
  root: string,
  problem: PracticeProblem,
  contract: string,
  attemptNumber: number,
  generated: GeneratedPracticeVariant,
  now = new Date(),
): Promise<FreshPracticeWorkspacePaths> {
  const paths = freshPracticeWorkspacePaths(root, problem.id, attemptNumber)
  await mkdir(path.dirname(paths.directory), { recursive: true })
  try {
    await mkdir(paths.directory)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new Error(`Fresh practice attempt already exists: ${paths.directory}`, {
        cause: error,
      })
    }
    throw error
  }

  const record: GeneratedPracticeAttempt = {
    version: 1,
    base_problem_id: problem.id,
    attempt_number: attemptNumber,
    generated_at: now.toISOString(),
    generator: 'codex',
    variant: generated,
  }
  await Promise.all([
    writeFile(paths.solution, starterSolution(problem.id, generated.title, contract), 'utf8'),
    writeFile(paths.analysis, starterAnalysis(generated.title), 'utf8'),
    writeFile(
      paths.prompt,
      generatedPrompt(problem.id, attemptNumber, generated, contract),
      'utf8',
    ),
    writeFile(paths.variant, `${JSON.stringify(record, null, 2)}\n`, 'utf8'),
    writeFile(
      paths.tsconfig,
      `${JSON.stringify(
        {
          extends: '../../../../tsconfig.json',
          compilerOptions: { noEmit: true },
          include: ['./solution.ts'],
          exclude: [],
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
  ])
  return paths
}

export async function practiceWorkspaceExists(paths: PracticeWorkspacePaths): Promise<boolean> {
  try {
    await access(paths.solution)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

async function writeIfMissing(target: string, content: string): Promise<boolean> {
  try {
    await writeFile(target, content, { encoding: 'utf8', flag: 'wx' })
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') return false
    throw error
  }
}

function starterSolution(problemId: string, title: string, contract: string): string {
  return `// ${problemId}: ${title}
// Implement only the exported practice function. The shared node types are supplied for contracts
// that need them; unused declarations are harmless.

export class ListNode {
  constructor(
    public val: number,
    public next: ListNode | null = null,
  ) {}
}

export class RandomListNode {
  constructor(
    public val: number,
    public next: RandomListNode | null = null,
    public related: RandomListNode | null = null,
  ) {}
}

export class TreeNode {
  constructor(
    public val: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}

export class GraphNode {
  constructor(
    public val: number,
    public neighbors: GraphNode[] = [],
  ) {}
}

${contract} {
  throw new Error('TODO: implement ${problemId}')
}
`
}

function starterAnalysis(title: string): string {
  return `# Practice Analysis: ${title}

## Clarifying questions

- TODO

## Examples and edge cases

- TODO

## Baseline approach and cost

TODO

## Optimized approach

TODO

## Invariant and correctness

TODO

## Final complexity

TODO

## Reflection

What signal would help you recognize a related problem next time?
`
}

function generatedPrompt(
  problemId: string,
  attemptNumber: number,
  generated: GeneratedPracticeVariant,
  contract: string,
): string {
  const examples = generated.examples
    .map((example) => {
      const explanation = example.explanation ? `\nWhy: ${example.explanation}` : ''
      return `Input: ${example.input}\nOutput: ${example.output}${explanation}`
    })
    .join('\n\n')
  return `# ${generated.title}

${generated.statement}

## TypeScript contract

\`\`\`ts
${contract}
\`\`\`

## Constraints

${generated.constraints.map((constraint) => `- ${constraint}`).join('\n')}

## Examples

${examples}

Base catalog ID: ${problemId}
Fresh attempt: ${attemptNumber}
`
}
