import { createHash } from 'node:crypto'
import path from 'node:path'
import {
  loadPracticeCatalog,
  loadCoreLessonMap,
  loadConceptGuides,
  loadPracticeContracts,
  allPracticeProblems,
  findPracticeGroup,
  findPracticeProblem,
} from './catalog.js'
import { loadLessons } from '../core/lessons.js'
import { runProcess } from '../core/process.js'
import { loadState } from '../core/state.js'
import {
  loadPracticeProgress,
  recordPracticeAttempt,
  recordPracticeCompletion,
  savePracticeProgress,
  type PracticeProgress,
} from './progress.js'
import { readyPracticeProblems } from './readiness.js'
import {
  preparePracticeWorkspace,
  practiceWorkspaceExists,
  practiceWorkspacePaths,
} from './workspace.js'
import type {
  ConceptGuide,
  ConceptGuideMap,
  CoreLessonLink,
  PracticeCatalog,
  PracticeContractMap,
  PracticeGroup,
  PracticeProblem,
} from './models.js'

const root = process.cwd()

async function main(): Promise<void> {
  const [catalog, coreLessonMap, conceptGuides, practiceContracts, lessons, practiceProgress] =
    await Promise.all([
      loadPracticeCatalog(root),
      loadCoreLessonMap(root),
      loadConceptGuides(root),
      loadPracticeContracts(root),
      loadLessons(root),
      loadPracticeProgress(root),
    ])
  const workshopState = await loadState(root, lessons)
  const command = process.argv[2] ?? 'groups'

  switch (command) {
    case 'groups':
      printGroups(catalog)
      return
    case 'list':
      printList(catalog, process.argv[3])
      return
    case 'map':
      printCoreMap(catalog, coreLessonMap, process.argv[3])
      return
    case 'learn': {
      const group = requireGroupOrId(catalog, process.argv[3])
      printConceptGuide(group, requireGuide(conceptGuides, group.id))
      return
    }
    case 'hint': {
      const problem = requireProblem(catalog, process.argv[3])
      const group = requireGroup(catalog, problem.id)
      printPracticeHint(problem, requireGuide(conceptGuides, group.id), process.argv[4])
      return
    }
    case 'show':
      printPrompt(
        requireProblem(catalog, process.argv[3]),
        requireContract(practiceContracts, process.argv[3]),
      )
      return
    case 'sample': {
      const candidates = problemsInGroup(catalog, process.argv[3])
      const seed = process.argv[4] ?? new Date().toISOString().slice(0, 10)
      const problem = candidates[seededIndex(seed, candidates.length)]!
      printPrompt(problem, requireContract(practiceContracts, problem.id))
      return
    }
    case 'ready': {
      const completedOrder = lessons.filter(
        (lesson) => workshopState.lessons[lesson.id]!.passedAt,
      ).length
      const candidates = readyPracticeProblems(
        problemsInGroup(catalog, process.argv[3]),
        coreLessonMap,
        practiceProgress,
        completedOrder,
      )
      if (candidates.length === 0) {
        console.log(
          completedOrder === 0
            ? 'No supplemental problems are ready yet. Advance the core curriculum until a mapped problem becomes eligible, or use `just practice sample` for an unrestricted prompt.'
            : 'Every currently eligible problem in this selection is complete. Advance the core curriculum, choose another group, or use `just practice sample`.',
        )
        return
      }
      const seed = process.argv[4] ?? new Date().toISOString().slice(0, 10)
      const problem = candidates[seededIndex(seed, candidates.length)]!
      printPrompt(problem, requireContract(practiceContracts, problem.id))
      return
    }
    case 'start': {
      const problem = requireProblem(catalog, process.argv[3])
      const workspace = await preparePracticeWorkspace(
        root,
        problem,
        requireContract(practiceContracts, problem.id),
      )
      recordPracticeAttempt(practiceProgress, problem.id)
      await savePracticeProgress(root, practiceProgress)
      printPrompt(problem, requireContract(practiceContracts, problem.id))
      console.log(`\nAttempt ${practiceProgress.problems[problem.id]!.attempts} recorded.`)
      console.log(
        workspace.created ? 'Practice workspace created:' : 'Existing workspace preserved:',
      )
      console.log(`Analysis: ${path.relative(root, workspace.analysis)}`)
      console.log(`Solution: ${path.relative(root, workspace.solution)}`)
      console.log(`Type-check with: just practice check ${problem.id}`)
      return
    }
    case 'check': {
      const problem = requireProblem(catalog, process.argv[3])
      const workspace = practiceWorkspacePaths(root, problem.id)
      if (!(await practiceWorkspaceExists(workspace))) {
        throw new Error(
          `No workspace exists for ${problem.id}. Run \`just practice start ${problem.id}\`.`,
        )
      }
      const result = await runProcess(
        'pnpm',
        ['exec', 'tsc', '--noEmit', '--project', workspace.tsconfig],
        { cwd: root, environment: process.env, timeoutMs: 30_000 },
      )
      if (result.timedOut) throw new Error('Practice type-check timed out after 30 seconds.')
      if (result.exitCode !== 0) {
        console.log(result.stdout)
        console.log(result.stderr)
        process.exitCode = 1
        return
      }
      console.log(
        `${problem.id} TYPECHECKED — this confirms the contract, not algorithm correctness.`,
      )
      return
    }
    case 'done': {
      const problem = requireProblem(catalog, process.argv[3])
      const confidence = parseConfidence(process.argv[4])
      recordPracticeCompletion(practiceProgress, problem.id, confidence)
      await savePracticeProgress(root, practiceProgress)
      console.log(`${problem.id} marked complete with confidence ${confidence}/5.`)
      return
    }
    case 'progress':
      printPracticeProgress(catalog, practiceProgress, process.argv[3])
      return
    case 'reveal':
      printReveal(
        requireProblem(catalog, process.argv[3]),
        requireGroup(catalog, process.argv[3]),
        coreLessonMap[process.argv[3] ?? ''] ?? [],
      )
      return
    default:
      throw new Error(
        'Use groups, list [group], map [group], learn <group|id>, hint <id> [1-3], show <id>, sample [group] [seed], ready [group] [seed], start <id>, check <id>, done <id> <1-5>, progress [group], or reveal <id>.',
      )
  }
}

function printGroups(catalog: PracticeCatalog): void {
  console.log(`Supplemental practice catalog: ${allPracticeProblems(catalog).length} problems`)
  for (const group of catalog.groups) {
    console.log(
      `${group.id.padEnd(24)} ${String(group.problems.length).padStart(2)}  ${group.title}`,
    )
  }
}

function printList(catalog: PracticeCatalog, groupId?: string): void {
  const problems = problemsInGroup(catalog, groupId)
  for (const problem of problems) {
    console.log(`${problem.id.padEnd(18)} ${problem.difficulty.padEnd(6)} ${problem.title}`)
  }
}

function printCoreMap(
  catalog: PracticeCatalog,
  coreLessonMap: Record<string, CoreLessonLink[]>,
  groupId?: string,
): void {
  for (const problem of problemsInGroup(catalog, groupId)) {
    const lessons = (coreLessonMap[problem.id] ?? [])
      .map((link) => `${link.lesson_id} (${link.relationship})`)
      .join(', ')
    console.log(`${problem.id.padEnd(18)} ${lessons}`)
  }
}

function printConceptGuide(group: PracticeGroup, guide: ConceptGuide): void {
  console.log(`${group.title}\n`)
  console.log(guide.blurb)
  console.log(`\nRecommended after core lesson ${guide.recommended_after_lesson}.`)
  if (guide.resource) {
    console.log(`Resource: ${guide.resource.title}`)
    console.log(`${guide.resource.source} ${guide.resource.format}: ${guide.resource.url}`)
  }
  console.log('\nWhen you are ready to practice blind:')
  console.log(`just practice ready ${group.id}`)
}

function printPracticeHint(
  problem: PracticeProblem,
  guide: ConceptGuide,
  requestedLevel?: string,
): void {
  const level = requestedLevel === undefined ? 1 : Number(requestedLevel)
  if (!Number.isInteger(level) || level < 1 || level > 3) {
    throw new Error('Hint level must be 1, 2, or 3.')
  }
  console.log(`${problem.id}: hint ${level}/3`)
  console.log(guide.hint_ladder[level - 1])
}

function printPrompt(problem: PracticeProblem, contract: string): void {
  console.log(`${problem.title} (${problem.difficulty})\n`)
  console.log(problem.statement)
  console.log(`\nTypeScript contract\n${contract}`)
  console.log('\nConstraints')
  for (const constraint of problem.constraints) console.log(`- ${constraint}`)
  console.log('\nExamples')
  for (const example of problem.examples) {
    console.log(`Input:  ${JSON.stringify(example.input)}`)
    console.log(`Output: ${JSON.stringify(example.output)}`)
    if (example.explanation) console.log(`Why:    ${example.explanation}`)
  }
  console.log(`\nCatalog id: ${problem.id}`)
  console.log(`After your attempt: just practice reveal ${problem.id}`)
}

function printReveal(
  problem: PracticeProblem,
  group: PracticeGroup,
  coreLessons: CoreLessonLink[],
): void {
  console.log(`${problem.id}: ${problem.title}`)
  console.log(`Primary concept: ${problem.primary_concept}`)
  console.log(`Secondary concepts: ${problem.secondary_concepts.join(', ') || 'none'}`)
  console.log(
    `Expected complexity: ${problem.expected_complexity.time} time, ${problem.expected_complexity.space} space`,
  )
  console.log('Edge cases:')
  for (const edgeCase of problem.edge_cases) console.log(`- ${edgeCase}`)
  console.log('Recognition signals:')
  for (const signal of group.recognition_signals) console.log(`- ${signal}`)
  console.log('Common wrong approaches:')
  for (const approach of group.common_wrong_approaches) console.log(`- ${approach}`)
  console.log('Core curriculum connections:')
  for (const link of coreLessons) {
    console.log(`- ${link.lesson_id} (${link.relationship}) — ${link.connection}`)
  }
  for (const related of problem.related_lessons) {
    console.log(`Catalog distinction: ${related.id} — ${related.distinction}`)
  }
}

function problemsInGroup(catalog: PracticeCatalog, groupId?: string): PracticeProblem[] {
  if (!groupId) return allPracticeProblems(catalog)
  const group = catalog.groups.find((candidate) => candidate.id === groupId)
  if (!group) throw new Error(`Unknown practice group: ${groupId}`)
  return group.problems
}

function requireProblem(catalog: PracticeCatalog, id?: string): PracticeProblem {
  if (!id) throw new Error('A practice problem id is required.')
  const problem = findPracticeProblem(catalog, id)
  if (!problem) throw new Error(`Unknown practice problem: ${id}`)
  return problem
}

function requireGroup(catalog: PracticeCatalog, problemId?: string): PracticeGroup {
  if (!problemId) throw new Error('A practice problem id is required.')
  const group = findPracticeGroup(catalog, problemId)
  if (!group) throw new Error(`No practice group contains: ${problemId}`)
  return group
}

function requireGroupOrId(catalog: PracticeCatalog, target?: string): PracticeGroup {
  if (!target) throw new Error('A practice group or problem id is required.')
  const group =
    catalog.groups.find((candidate) => candidate.id === target) ??
    findPracticeGroup(catalog, target)
  if (!group) throw new Error(`Unknown practice group or problem: ${target}`)
  return group
}

function requireGuide(guides: ConceptGuideMap, groupId: string): ConceptGuide {
  const guide = guides[groupId]
  if (!guide) throw new Error(`No concept guide is registered for ${groupId}`)
  return guide
}

function requireContract(contracts: PracticeContractMap, problemId?: string): string {
  if (!problemId) throw new Error('A practice problem id is required.')
  const contract = contracts[problemId]
  if (!contract) throw new Error(`No TypeScript contract is registered for ${problemId}`)
  return contract
}

function parseConfidence(raw?: string): number {
  const confidence = Number(raw)
  if (!Number.isInteger(confidence) || confidence < 1 || confidence > 5) {
    throw new Error('Confidence must be an integer from 1 through 5.')
  }
  return confidence
}

function printPracticeProgress(
  catalog: PracticeCatalog,
  progress: PracticeProgress,
  groupId?: string,
): void {
  const problems = problemsInGroup(catalog, groupId)
  const attempted = problems.filter((problem) => (progress.problems[problem.id]?.attempts ?? 0) > 0)
  const completed = problems.filter((problem) => progress.problems[problem.id]?.completedAt)
  const confidences = completed
    .map((problem) => progress.problems[problem.id]?.confidence)
    .filter((value): value is number => value !== null && value !== undefined)
  console.log(`Practice progress: ${completed.length}/${problems.length} complete`)
  console.log(`Attempted: ${attempted.length}`)
  if (confidences.length > 0) {
    const average = confidences.reduce((sum, value) => sum + value, 0) / confidences.length
    console.log(`Average confidence: ${average.toFixed(1)}/5`)
  }
}

function seededIndex(seed: string, length: number): number {
  const digest = createHash('sha256').update(seed).digest()
  return digest.readUInt32BE(0) % length
}

await main()
