import type { WorkshopConfig } from '../core/config.js'
import type { AnalysisEvaluator, CoachProvider } from './coach.js'
import { ClaudeCoachProvider } from './claude.js'
import { CodexCoachProvider } from './codex.js'

export function createCoachProvider(root: string, config: WorkshopConfig): CoachProvider | null {
  if (!config.coachProvider) return null
  switch (config.coachProvider) {
    case 'codex':
      return new CodexCoachProvider(root)
    case 'claude':
      return new ClaudeCoachProvider(root)
  }
}

export function createAnalysisEvaluator(
  root: string,
  config: WorkshopConfig,
): AnalysisEvaluator | null {
  switch (config.coachProvider) {
    case 'codex':
      return new CodexCoachProvider(root)
    case 'claude':
      return new ClaudeCoachProvider(root)
    default:
      return null
  }
}
