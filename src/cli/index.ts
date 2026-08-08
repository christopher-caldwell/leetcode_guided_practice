import 'dotenv/config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadConfig } from '../core/config.js'
import { saveAnalysisAssessment, saveDiagnosis, saveReview } from '../core/feedback.js'
import { LEARNER_ANALYSIS } from '../core/learner-files.js'
import { currentLesson, loadLessons } from '../core/lessons.js'
import type { CheckFailure, LessonManifest, WorkshopState } from '../core/models.js'
import { assessReadiness } from '../core/readiness.js'
import { handleResetCommand } from '../core/reset-command.js'
import { isReviewEligible, recordOfflineReview, selectReviewLesson } from '../core/review.js'
import { loadState, passedAtMap, saveState, stateDirectory } from '../core/state.js'
import {
  completeRecordedTimer,
  formatDuration,
  hasRecordedTime,
  pauseTimer,
  resetTimer,
  selectTimerLesson,
  startTimer,
  targetMinutes,
  timerApplies,
  timerSummary,
} from '../core/timer.js'
import { createAnalysisEvaluator, createCoachProvider } from '../providers/factory.js'
import type {
  AnalysisAssessmentResponse,
  AnalysisEvaluator,
  CoachContext,
  CoachProvider,
  HintResponse,
} from '../providers/coach.js'
import { revealReference } from '../reference/reveal.js'
import { checkTypeScript } from '../verification/typescript-adapter.js'
import { colors } from './colors.js'

const root = process.cwd()

async function main(): Promise<void> {
  const command = process.argv[2] ?? 'status'
  if (await handleResetCommand(root, command)) return

  const config = loadConfig()
  const lessons = await loadLessons(root)
  const state = await loadState(root, lessons)
  const provider = createCoachProvider(root, config)
  const analysisEvaluator = createAnalysisEvaluator(root, config)

  switch (command) {
    case 'status':
      showStatus(lessons, state, config, provider)
      break
    case 'start':
      await startLesson(lessons, state, config)
      break
    case 'check':
      await checkLesson(lessons, state, provider, analysisEvaluator)
      break
    case 'hint':
      await hint(lessons, state, provider)
      break
    case 'review':
      await review(lessons, state, provider, process.argv[3])
      break
    case 'solution':
      await reveal(lessons, state)
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
    printReadiness(lessons, state, config)
    return
  }

  const progress = state.lessons[lesson.id]!
  console.log(`${colors.cyan('Current:')} ${lesson.order}. ${lesson.title} (${lesson.difficulty})`)
  console.log(`Instructions: ${relative(path.join(lesson.directory, 'instructions.md'))}`)
  console.log(`Analysis:     ${relative(path.join(lesson.directory, LEARNER_ANALYSIS))}`)
  console.log(`Source:       ${relative(path.join(lesson.directory, lesson.source))}`)
  console.log(
    `Attempts: ${progress.attempts}; hints: ${progress.hintsUsed}; ` +
      `adaptive diagnoses: ${progress.diagnosesReceived}`,
  )
  if (progress.verifiedAt && !progress.passedAt) {
    console.log(
      `${colors.yellow('WAITING')} Code passed; the configured AI provider has not accepted the analysis yet.`,
    )
  }
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
  console.log(`Then edit ${relative(path.join(lesson.directory, LEARNER_ANALYSIS))}`)
  console.log(`and ${relative(path.join(lesson.directory, lesson.source))}`)
  const progress = state.lessons[lesson.id]!
  if (progress.verifiedAt) {
    console.log(
      'Implementation is already verified; run `just check` to request a new AI analysis assessment.',
    )
    return
  }
  if (!timerApplies(config, lesson)) {
    console.log(`Timer not started: WORKSHOP_TIMER_MODE=${config.timerMode}.`)
    return
  }
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
  provider: CoachProvider | null,
  analysisEvaluator: AnalysisEvaluator | null,
): Promise<void> {
  const lesson = requireCurrent(lessons, state)
  const progress = state.lessons[lesson.id]!
  progress.attempts += 1
  console.log(`${colors.cyan('CHECK')} ${lesson.id} — attempt ${progress.attempts}`)

  const result = await checkTypeScript(root, lesson)

  if (result.failures.length > 0) {
    await saveState(root, state)
    printFailures(result.failures)
    if (provider) {
      console.log(`\nRequesting progressively more direct coaching from ${provider.name}…`)
      try {
        const context = await coachContext(
          lesson,
          progress.attempts,
          progress.hintsUsed,
          result.failures,
        )
        const diagnosis = await provider.diagnose(context)
        const target = await saveDiagnosis(root, lesson.id, progress.attempts, diagnosis)
        progress.diagnosesReceived += 1
        await saveState(root, state)
        printDiagnosis(diagnosis)
        console.log(`Saved: ${relative(target)}`)
      } catch (error) {
        console.log(`External coaching unavailable: ${message(error)}`)
        console.log('Deterministic failure evidence above remains authoritative.')
      }
    }
    if (process.env.WORKSHOP_DEBUG === 'true' && result.output) {
      console.log(`\n${result.output}`)
    }
    process.exitCode = 1
    return
  }

  progress.verifiedAt ??= new Date().toISOString()
  const duration = completeRecordedTimer(progress.timer)
  if (duration !== null) {
    console.log(`Timer stopped at ${formatDuration(duration)}.`)
  }
  await saveState(root, state)
  console.log(
    `${colors.green('PASS')} — types and this lesson's correctness, contract, and complexity checks passed.`,
  )

  if (!analysisEvaluator) {
    progress.passedAt = new Date().toISOString()
    await saveState(root, state)
    console.log(
      `${colors.green('ADVANCED')} — deterministic checks passed; interview reasoning remains self-assessed because AI feedback is disabled.`,
    )
    printNextLesson(lessons, state)
    return
  }

  console.log(`Requesting analysis assessment from ${analysisEvaluator.name}…`)
  let assessment: AnalysisAssessmentResponse
  try {
    assessment = await analysisEvaluator.assessAnalysis(
      await coachContext(lesson, progress.attempts, progress.hintsUsed, []),
    )
  } catch (error) {
    console.log(`${colors.yellow('ANALYSIS UNAVAILABLE')} — ${message(error)}`)
    console.log(
      'Code verification is retained; progression is waiting for the configured provider.',
    )
    process.exitCode = 1
    return
  }

  const assessmentPath = await saveAnalysisAssessment(root, lesson.id, assessment)
  printAnalysisAssessment(analysisEvaluator.name, assessment)
  console.log(`Saved: ${relative(assessmentPath)}`)
  if (!assessment.passed) {
    console.log('Revise the analysis in your own words, then run `just check` again.')
    process.exitCode = 1
    return
  }

  const completedAt = new Date().toISOString()
  progress.reflectionCompletedAt = completedAt
  progress.passedAt = completedAt
  await saveState(root, state)
  console.log(
    `${colors.green('ADVANCED')} — code verification and ${analysisEvaluator.name} analysis assessment passed.`,
  )
  printNextLesson(lessons, state)
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
      question: 'What exact value, index, or state would you inspect or update next?',
    }
  }

  progress.hintsUsed = hintNumber
  const target = await saveHint(lesson.id, hintNumber, result)
  await saveState(root, state)
  console.log(`\n${colors.cyan(result.focus)}`)
  console.log(result.hint)
  console.log(`${colors.cyan('Question:')} ${result.question}`)
  console.log(`${colors.cyan('Saved:')} ${relative(target)}`)
}

async function review(
  lessons: LessonManifest[],
  state: WorkshopState,
  provider: CoachProvider | null,
  requestedId?: string,
): Promise<void> {
  const lesson = selectReviewLesson(lessons, state, requestedId)
  if (!lesson) throw new Error('Verify at least one lesson before requesting a review.')
  if (!isReviewEligible(lesson, state))
    throw new Error(`${lesson.id} has not passed deterministic verification yet.`)
  const progress = state.lessons[lesson.id]!

  if (!provider) {
    recordOfflineReview(progress)
    await saveState(root, state)
    console.log(`Offline analysis review recorded for ${lesson.id}.`)
    console.log('No external score was created; communication remains self-assessed.')
    return
  }

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
  if (!['status', 'start', 'pause', 'resume', 'reset'].includes(action)) {
    throw new Error('Timer action must be status, start, pause, resume, or reset.')
  }
  const lesson = selectTimerLesson(lessons, state, action)
  const progress = state.lessons[lesson.id]!
  const historicalStatus = action === 'status' && hasRecordedTime(progress.timer)
  if (!timerApplies(config, lesson) && !historicalStatus) {
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
  console.log(
    `Timer for ${lesson.id}: ${timerSummary(progress.timer, targetMinutes(config, lesson))}`,
  )
  if (!timerApplies(config, lesson)) {
    console.log(`Stored timing is shown even though WORKSHOP_TIMER_MODE=${config.timerMode}.`)
  }
}

async function coachContext(
  lesson: LessonManifest,
  attempts: number,
  hintsUsed: number,
  failures: CheckFailure[],
): Promise<CoachContext> {
  const [instructions, source, analysis] = await Promise.all([
    readFile(path.join(lesson.directory, 'instructions.md'), 'utf8'),
    readFile(path.join(lesson.directory, lesson.source), 'utf8'),
    readFile(path.join(lesson.directory, LEARNER_ANALYSIS), 'utf8'),
  ])
  return { lesson, instructions, source, analysis, attempts, hintsUsed, failures }
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
  console.log(colors.red('FAIL'))
  for (const failure of failures) {
    console.log(`\n${colors.red(`[${failure.category}]`)} ${failure.summary}`)
    console.log(failure.evidence)
  }
}

function printDiagnosis(result: Awaited<ReturnType<CoachProvider['diagnose']>>): void {
  console.log(`\n${colors.yellow(`[${result.category}]`)} ${result.observation}`)
  console.log(`${colors.cyan('Working:')} ${result.whatIsWorking}`)
  console.log(`${colors.cyan('Next:')} ${result.nextStep}`)
  console.log(`${colors.cyan('Question:')} ${result.question}`)
}

function printAnalysisAssessment(providerName: string, result: AnalysisAssessmentResponse): void {
  console.log(
    `\n${result.passed ? colors.green('ANALYSIS PASS') : colors.red('ANALYSIS FAIL')} — ${providerName} ${
      result.passed ? 'accepted' : 'did not accept'
    } the interview explanation.`,
  )
  console.log(`${colors.cyan('Feedback:')} ${result.feedback}`)
}

function printNextLesson(lessons: LessonManifest[], state: WorkshopState): void {
  const next = getCurrent(lessons, state)
  if (next) {
    console.log(`Next: ${next.order}. ${next.title}`)
    console.log(`Open ${relative(path.join(next.directory, 'instructions.md'))}`)
    return
  }
  console.log('All lessons passed. Use `just status` to review completion and review-queue state.')
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
  config: ReturnType<typeof loadConfig>,
): void {
  const evidence = assessReadiness(lessons, state, config)

  console.log('Curriculum complete.')
  console.log(
    'Unassisted means zero hints, zero successful adaptive diagnoses, and no solution reveal.',
  )
  console.log('Mixed simulation evidence:')
  for (const simulation of evidence.simulations) {
    const assistance: string[] = []
    if (simulation.hintsUsed > 0) assistance.push(`${simulation.hintsUsed} hint(s)`)
    if (simulation.diagnosesReceived > 0) {
      assistance.push(`${simulation.diagnosesReceived} diagnosis(es)`)
    }
    if (simulation.solutionRevealed) assistance.push('solution revealed')
    const timer =
      simulation.completedMs === null
        ? 'timer not recorded'
        : timerEvidence(simulation.completedMs, simulation.targetMinutes)
    const review =
      simulation.reviewScoresAcceptable === null
        ? 'communication self-assessed'
        : simulation.reviewScoresAcceptable
          ? 'coach scores >= 3'
          : 'coach score below 3'
    console.log(
      `- ${simulation.id} (${simulation.title}): ${simulation.unassisted ? 'unassisted' : assistance.join(', ') || 'assisted'}; ` +
        `${simulation.attempts} attempt(s); ${timer}; ${review}; ` +
        `reasoning ${simulation.reflectionCompleted ? 'AI-assessed' : 'self-assessed'}`,
    )
  }
  console.log(
    `Unassisted mixed simulations: ${evidence.unassistedCount}/${evidence.simulations.length}`,
  )
  console.log(
    `Unassisted simulations with all coach scores >= 3: ${evidence.acceptableReviewCount}`,
  )
  if (evidence.outstandingReviewIds.length > 0) {
    console.log(`Outstanding revealed-solution review: ${evidence.outstandingReviewIds.join(', ')}`)
  }
  console.log(`Readiness target: ${evidence.targetMet ? 'MET' : 'NOT YET MET'}`)
  if (!evidence.targetMet) {
    console.log('Complete the curriculum and clear any revealed-solution review debt.')
  }
}

function timerEvidence(completedMs: number, target: number): string {
  const targetMs = target * 60_000
  const overtime = completedMs > targetMs ? ` (${formatDuration(completedMs - targetMs)} over)` : ''
  return `${formatDuration(completedMs)} / ${target}m${overtime}`
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

main().catch((error: unknown) => {
  console.error(`Workshop error: ${message(error)}`)
  process.exitCode = 1
})
