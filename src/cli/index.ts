import 'dotenv/config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadConfig } from '../core/config.js'
import { saveDiagnosis, saveReview } from '../core/feedback.js'
import { validateAnalysis } from '../core/analysis.js'
import { currentLesson, loadLessons } from '../core/lessons.js'
import type { CheckFailure, LessonManifest, WorkshopState } from '../core/models.js'
import { loadState, passedAtMap, resetState, saveState, stateDirectory } from '../core/state.js'
import {
  completeTimer,
  formatDuration,
  pauseTimer,
  resetTimer,
  startTimer,
  targetMinutes,
  timerApplies,
  timerSummary,
} from '../core/timer.js'
import { createCoachProvider, shouldCoachAttempt } from '../providers/factory.js'
import type { CoachContext, CoachProvider, HintResponse } from '../providers/coach.js'
import { revealReference } from '../reference/reveal.js'
import { checkTypeScript } from '../verification/typescript-adapter.js'

const root = process.cwd()

async function main(): Promise<void> {
  const config = loadConfig()
  const lessons = await loadLessons(root)
  const state = await loadState(root, lessons)
  const provider = createCoachProvider(root, config)
  const command = process.argv[2] ?? 'status'

  switch (command) {
    case 'status':
      showStatus(lessons, state, config, provider)
      break
    case 'start':
      await startLesson(lessons, state, config)
      break
    case 'check':
      await checkLesson(lessons, state, config, provider)
      break
    case 'hint':
      await hint(lessons, state, provider)
      break
    case 'review':
      await review(lessons, state, provider)
      break
    case 'solution':
      await reveal(lessons, state)
      break
    case 'reset':
      await resetState(root)
      console.log('Workshop progress, feedback, revealed references, and timers were cleared.')
      console.log('Learner analysis and solution files were not changed.')
      break
    case 'timer':
      await manageTimer(lessons, state, config, process.argv[3] ?? 'status')
      break
    default:
      throw new Error(
        `Unknown command "${command}". Use status, start, check, hint, review, solution, reset, or timer.`,
      )
  }
}

function showStatus(
  lessons: LessonManifest[],
  state: WorkshopState,
  config: ReturnType<typeof loadConfig>,
  provider: CoachProvider | null,
): void {
  const lesson = getCurrent(lessons, state)
  const completed = lessons.filter((item) => state.lessons[item.id]!.passedAt).length
  const reviewQueue = lessons.filter((item) => state.lessons[item.id]!.reviewRequired)
  console.log(`Progress: ${completed}/${lessons.length} lessons passed`)
  console.log(`External coaching: ${provider?.name ?? 'disabled (static hints remain available)'}`)
  console.log(`Timer mode: ${config.timerMode}`)
  if (reviewQueue.length > 0) {
    console.log(`Review queue: ${reviewQueue.map((item) => item.id).join(', ')}`)
  }
  console.log('')

  if (!lesson) {
    printReadiness(lessons, state, provider)
    return
  }

  const progress = state.lessons[lesson.id]!
  console.log(`Current: ${lesson.order}. ${lesson.title} (${lesson.difficulty})`)
  console.log(`Instructions: ${relative(path.join(lesson.directory, 'instructions.md'))}`)
  console.log(`Analysis:     ${relative(path.join(lesson.directory, 'analysis.md'))}`)
  console.log(`Source:       ${relative(path.join(lesson.directory, lesson.source))}`)
  console.log(`Attempts: ${progress.attempts}; hints: ${progress.hintsUsed}`)
  if (timerApplies(config, lesson)) {
    console.log(`Timer: ${timerSummary(progress.timer, targetMinutes(config, lesson))}`)
    if (!progress.timer.startedAt && progress.timer.accumulatedMs === 0) {
      console.log('Run `just start` when you intentionally want the stopwatch to begin.')
    }
  } else {
    console.log('Timer: not active for this lesson under the current mode.')
  }
}

async function startLesson(
  lessons: LessonManifest[],
  state: WorkshopState,
  config: ReturnType<typeof loadConfig>,
): Promise<void> {
  const lesson = requireCurrent(lessons, state)
  console.log(`Lesson ${lesson.order}: ${lesson.title}`)
  console.log(`Open ${relative(path.join(lesson.directory, 'instructions.md'))}`)
  console.log(`Then edit ${relative(path.join(lesson.directory, 'analysis.md'))}`)
  console.log(`and ${relative(path.join(lesson.directory, lesson.source))}`)
  if (!timerApplies(config, lesson)) {
    console.log(`Timer not started: WORKSHOP_TIMER_MODE=${config.timerMode}.`)
    return
  }
  const progress = state.lessons[lesson.id]!
  const result = startTimer(progress.timer)
  await saveState(root, state)
  console.log(
    result === 'started'
      ? `Timer started with a ${targetMinutes(config, lesson)} minute target.`
      : 'Timer was already running.',
  )
}

async function checkLesson(
  lessons: LessonManifest[],
  state: WorkshopState,
  config: ReturnType<typeof loadConfig>,
  provider: CoachProvider | null,
): Promise<void> {
  const lesson = requireCurrent(lessons, state)
  const progress = state.lessons[lesson.id]!
  progress.attempts += 1
  console.log(`Checking ${lesson.id} — attempt ${progress.attempts}`)

  let failures = await validateAnalysis(lesson)
  let output = ''
  if (failures.length === 0) {
    const result = await checkTypeScript(root, lesson)
    failures = result.failures
    output = result.output
  }

  if (failures.length > 0) {
    await saveState(root, state)
    printFailures(failures)
    if (provider && shouldCoachAttempt(progress.attempts)) {
      console.log(
        `\nRequesting ${provider.name} coaching at Fibonacci attempt ${progress.attempts}…`,
      )
      try {
        const context = await coachContext(lesson, progress.attempts, progress.hintsUsed, failures)
        const diagnosis = await provider.diagnose(context)
        const target = await saveDiagnosis(root, lesson.id, progress.attempts, diagnosis)
        printDiagnosis(diagnosis)
        console.log(`Saved: ${relative(target)}`)
      } catch (error) {
        console.log(`External coaching unavailable: ${message(error)}`)
        console.log('Deterministic failure evidence above remains authoritative.')
      }
    } else if (provider) {
      console.log('\nExternal diagnosis is scheduled at attempts 1, 2, 3, 5, 8, 13…')
    }
    if (process.env.WORKSHOP_DEBUG === 'true' && output) console.log(`\n${output}`)
    process.exitCode = 1
    return
  }

  progress.passedAt = new Date().toISOString()
  progress.reviewRequired = progress.solutionRevealedAt !== null
  if (
    timerApplies(config, lesson) &&
    (progress.timer.startedAt || progress.timer.accumulatedMs > 0)
  ) {
    const duration = completeTimer(progress.timer)
    console.log(`Timer stopped at ${formatDuration(duration)}.`)
  }
  await saveState(root, state)
  console.log(
    'PASS — deterministic analysis, type, correctness, contract, and complexity checks passed.',
  )

  if (provider) {
    console.log(`Requesting advisory ${provider.name} review of the passing solution…`)
    try {
      const context = await coachContext(lesson, progress.attempts, progress.hintsUsed, [])
      const result = await provider.review(context)
      const target = await saveReview(root, lesson.id, result)
      progress.latestReviewPath = relative(target)
      progress.latestReviewScores = result.scores
      await saveState(root, state)
      printReview(result)
      console.log(`Saved: ${relative(target)}`)
    } catch (error) {
      console.log(`Advisory review unavailable: ${message(error)}`)
      console.log('The deterministic pass is retained.')
    }
  }

  const next = getCurrent(lessons, state)
  if (next) {
    console.log(`Next: ${next.order}. ${next.title}`)
    console.log(`Open ${relative(path.join(next.directory, 'instructions.md'))}`)
  } else {
    console.log(
      'All lessons passed. Use `just status` to review completion and review-queue state.',
    )
  }
}

async function hint(
  lessons: LessonManifest[],
  state: WorkshopState,
  provider: CoachProvider | null,
): Promise<void> {
  const lesson = requireCurrent(lessons, state)
  const progress = state.lessons[lesson.id]!
  const hintNumber = progress.hintsUsed + 1
  let result: HintResponse | null = null

  if (provider) {
    console.log(`Requesting a small hint from ${provider.name}…`)
    try {
      result = await provider.hint(
        await coachContext(lesson, progress.attempts, progress.hintsUsed, []),
      )
    } catch (error) {
      console.log(`External hint unavailable: ${message(error)}`)
    }
  }

  if (!result) {
    const index = Math.min(progress.hintsUsed, lesson.hints.length - 1)
    result = {
      focus: `Static hint ${index + 1}/${lesson.hints.length}`,
      hint: lesson.hints[index]!,
      question: 'What does this change about the next smallest experiment you can make?',
    }
  }

  progress.hintsUsed = hintNumber
  const target = await saveHint(lesson.id, hintNumber, result)
  await saveState(root, state)
  console.log(`\n${result.focus}`)
  console.log(result.hint)
  console.log(`Question: ${result.question}`)
  console.log(`Saved: ${relative(target)}`)
}

async function review(
  lessons: LessonManifest[],
  state: WorkshopState,
  provider: CoachProvider | null,
): Promise<void> {
  const reversed = [...lessons].reverse()
  const lesson =
    reversed.find(
      (item) => state.lessons[item.id]!.passedAt && state.lessons[item.id]!.reviewRequired,
    ) ?? reversed.find((item) => state.lessons[item.id]!.passedAt)
  if (!lesson) throw new Error('Pass at least one lesson before requesting a review.')
  if (!provider) {
    console.log(
      'No external coach is configured. Set COACH_PROVIDER=codex to request structured review.',
    )
    console.log(
      `Use the post-pass reflection in ${relative(path.join(lesson.directory, 'analysis.md'))}.`,
    )
    return
  }
  const progress = state.lessons[lesson.id]!
  console.log(`Reviewing ${lesson.id} with ${provider.name}…`)
  const result = await provider.review(
    await coachContext(lesson, progress.attempts, progress.hintsUsed, []),
  )
  const target = await saveReview(root, lesson.id, result)
  progress.latestReviewPath = relative(target)
  progress.latestReviewScores = result.scores
  progress.reviewRequired = false
  await saveState(root, state)
  printReview(result)
  console.log(`Saved: ${relative(target)}`)
}

async function reveal(lessons: LessonManifest[], state: WorkshopState): Promise<void> {
  const lesson = requireCurrent(lessons, state)
  const progress = state.lessons[lesson.id]!
  const target = await revealReference(root, lesson.id)
  progress.solutionRevealedAt = new Date().toISOString()
  progress.reviewRequired = true
  await saveState(root, state)
  console.log('Reference solution explicitly revealed. Your learner source was not changed.')
  console.log(`Reference: ${relative(target)}`)
  console.log('This lesson is marked review-required even if it later passes.')
}

async function manageTimer(
  lessons: LessonManifest[],
  state: WorkshopState,
  config: ReturnType<typeof loadConfig>,
  action: string,
): Promise<void> {
  const lesson = getCurrent(lessons, state) ?? lessons.at(-1)!
  const progress = state.lessons[lesson.id]!
  if (!timerApplies(config, lesson)) {
    console.log(
      `Timing does not apply to ${lesson.id} while WORKSHOP_TIMER_MODE=${config.timerMode}.`,
    )
    console.log('See docs/timer.md before changing timer configuration.')
    return
  }

  switch (action) {
    case 'status':
      break
    case 'start':
    case 'resume':
      console.log(
        startTimer(progress.timer) === 'started' ? 'Timer started.' : 'Timer already running.',
      )
      break
    case 'pause':
      console.log(
        pauseTimer(progress.timer) === 'paused' ? 'Timer paused.' : 'Timer was not running.',
      )
      break
    case 'reset':
      resetTimer(progress.timer)
      console.log('Current lesson timer reset. Progress and learner files were preserved.')
      break
    default:
      throw new Error('Timer action must be status, start, pause, resume, or reset.')
  }
  await saveState(root, state)
  console.log(timerSummary(progress.timer, targetMinutes(config, lesson)))
}

async function coachContext(
  lesson: LessonManifest,
  attempts: number,
  hintsUsed: number,
  failures: CheckFailure[],
): Promise<CoachContext> {
  const [source, analysis] = await Promise.all([
    readFile(path.join(lesson.directory, lesson.source), 'utf8'),
    readFile(path.join(lesson.directory, 'analysis.md'), 'utf8'),
  ])
  return { lesson, source, analysis, attempts, hintsUsed, failures }
}

async function saveHint(
  lessonId: string,
  hintNumber: number,
  result: HintResponse,
): Promise<string> {
  const directory = path.join(stateDirectory(root), 'feedback', lessonId)
  await mkdir(directory, { recursive: true })
  const target = path.join(directory, `hint-${hintNumber}.md`)
  await writeFile(
    target,
    `# Hint ${hintNumber}\n\n**Focus:** ${result.focus}\n\n${result.hint}\n\n**Question:** ${result.question}\n`,
    'utf8',
  )
  return target
}

function getCurrent(lessons: LessonManifest[], state: WorkshopState): LessonManifest | null {
  return currentLesson(lessons, passedAtMap(state))
}

function requireCurrent(lessons: LessonManifest[], state: WorkshopState): LessonManifest {
  const lesson = getCurrent(lessons, state)
  if (!lesson) throw new Error('All lessons are already passed. Reset progress to begin again.')
  return lesson
}

function relative(target: string): string {
  return path.relative(root, target) || '.'
}

function printFailures(failures: CheckFailure[]): void {
  console.log('FAIL')
  for (const failure of failures) {
    console.log(`\n[${failure.category}] ${failure.summary}`)
    console.log(failure.evidence)
  }
}

function printDiagnosis(result: Awaited<ReturnType<CoachProvider['diagnose']>>): void {
  console.log(`\n[${result.category}] ${result.observation}`)
  console.log(`Working: ${result.whatIsWorking}`)
  console.log(`Next: ${result.nextStep}`)
  console.log(`Question: ${result.question}`)
}

function printReview(result: Awaited<ReturnType<CoachProvider['review']>>): void {
  const scores = result.scores
  console.log(
    `Scores — correctness ${scores.correctness}/4, complexity ${scores.complexity}/4, ` +
      `clarity ${scores.clarity}/4, communication ${scores.communication}/4`,
  )
  for (const improvement of result.improvements) console.log(`Improve: ${improvement}`)
  console.log(result.summary)
}

function printReadiness(
  lessons: LessonManifest[],
  state: WorkshopState,
  provider: CoachProvider | null,
): void {
  const simulations = lessons.filter(
    (lesson) => lesson.kind === 'checkpoint' || lesson.kind === 'final',
  )
  const independent = simulations.filter((lesson) => {
    const progress = state.lessons[lesson.id]!
    return progress.passedAt && !progress.solutionRevealedAt
  })
  const acceptableReviews = independent.filter((lesson) => {
    const scores = state.lessons[lesson.id]!.latestReviewScores
    return scores && Object.values(scores).every((score) => score >= 3)
  })
  const final = state.lessons[lessons.at(-1)!.id]!
  const targetMet =
    independent.length >= 2 &&
    final.passedAt !== null &&
    final.solutionRevealedAt === null &&
    (provider ? acceptableReviews.length >= 2 : true)

  console.log('Curriculum complete.')
  console.log(`Independent mixed simulations: ${independent.length}/${simulations.length}`)
  if (provider) {
    console.log(`Independent simulations with all review scores >= 3: ${acceptableReviews.length}`)
  } else {
    console.log(
      'External review evidence: not configured; deterministic completion is still recorded.',
    )
  }
  console.log(`Readiness target: ${targetMet ? 'MET' : 'NOT YET MET'}`)
  if (!targetMet) {
    console.log(
      'Revisit review-queue lessons and complete at least two mixed simulations without revealing solutions.',
    )
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

main().catch((error: unknown) => {
  console.error(`Workshop error: ${message(error)}`)
  process.exitCode = 1
})
