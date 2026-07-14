import type { WorkshopConfig } from '../core/config.js'
import type { CoachProvider } from './coach.js'
import { CodexCoachProvider } from './codex.js'

export function createCoachProvider(root: string, config: WorkshopConfig): CoachProvider | null {
  if (!config.coachProvider) return null
  switch (config.coachProvider) {
    case 'codex':
      return new CodexCoachProvider(root)
  }
}

export function shouldCoachAttempt(attempt: number): boolean {
  if (attempt < 1) return false
  let previous = 1
  let current = 1
  while (current < attempt) {
    const next = previous + current
    previous = current
    current = next
  }
  return current === attempt
}
