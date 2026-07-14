import type { LessonManifest, TimerState } from './models.js'
import type { WorkshopConfig } from './config.js'

export function timerApplies(config: WorkshopConfig, lesson: LessonManifest): boolean {
  if (config.timerMode === 'off') return false
  if (config.timerMode === 'all') return true
  return lesson.kind === 'checkpoint' || lesson.kind === 'final'
}

export function targetMinutes(config: WorkshopConfig, lesson: LessonManifest): number {
  return config.timerMinutes ?? lesson.recommendedMinutes
}

export function elapsedMs(timer: TimerState, now = Date.now()): number {
  if (!timer.startedAt) return timer.accumulatedMs
  return timer.accumulatedMs + Math.max(0, now - Date.parse(timer.startedAt))
}

export function startTimer(timer: TimerState, now = new Date()): 'started' | 'already-running' {
  if (timer.startedAt) return 'already-running'
  timer.startedAt = now.toISOString()
  timer.segments += 1
  timer.completedMs = null
  return 'started'
}

export function pauseTimer(timer: TimerState, now = new Date()): 'paused' | 'not-running' {
  if (!timer.startedAt) return 'not-running'
  timer.accumulatedMs += Math.max(0, now.getTime() - Date.parse(timer.startedAt))
  timer.startedAt = null
  return 'paused'
}

export function completeTimer(timer: TimerState, now = new Date()): number {
  pauseTimer(timer, now)
  timer.completedMs = timer.accumulatedMs
  return timer.accumulatedMs
}

export function resetTimer(timer: TimerState): void {
  timer.accumulatedMs = 0
  timer.startedAt = null
  timer.segments = 0
  timer.completedMs = null
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1_000)
  const hours = Math.floor(totalSeconds / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

export function timerSummary(timer: TimerState, target: number, now = Date.now()): string {
  const elapsed = elapsedMs(timer, now)
  const targetMs = target * 60_000
  const state = timer.startedAt ? 'running' : timer.completedMs !== null ? 'completed' : 'stopped'
  const overtime = elapsed > targetMs ? ` — ${formatDuration(elapsed - targetMs)} over target` : ''
  return `${state}: ${formatDuration(elapsed)} / ${target}m${overtime}`
}
