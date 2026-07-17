import type { WorkshopConfig } from '../core/config.js'
import type { AnalysisEvaluator, CoachProvider } from './coach.js'
import { CodexCoachProvider } from './codex.js'

export function createCoachProvider(root: string, config: WorkshopConfig): CoachProvider | null {
  if (!config.coachProvider) return null
  switch (config.coachProvider) {
    case 'codex':
      return new CodexCoachProvider(root)
  }
}

export function createAnalysisEvaluator(root: string): AnalysisEvaluator {
  return new CodexCoachProvider(root)
}
