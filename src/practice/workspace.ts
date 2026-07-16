import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { PracticeProblem } from './models.js'

export interface PracticeWorkspacePaths {
  directory: string
  solution: string
  analysis: string
  tsconfig: string
}

export interface PreparedPracticeWorkspace extends PracticeWorkspacePaths {
  created: boolean
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

export async function preparePracticeWorkspace(
  root: string,
  problem: PracticeProblem,
  contract: string,
): Promise<PreparedPracticeWorkspace> {
  const paths = practiceWorkspacePaths(root, problem.id)
  await mkdir(paths.directory, { recursive: true })
  const writes = await Promise.all([
    writeIfMissing(paths.solution, starterSolution(problem, contract)),
    writeIfMissing(paths.analysis, starterAnalysis(problem)),
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

function starterSolution(problem: PracticeProblem, contract: string): string {
  return `// ${problem.id}: ${problem.title}
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
  throw new Error('TODO: implement ${problem.id}')
}
`
}

function starterAnalysis(problem: PracticeProblem): string {
  return `# Practice Analysis: ${problem.title}

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
