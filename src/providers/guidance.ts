export function diagnosisGuidancePercent(attempt: number): number {
  if (attempt < 1) return 0
  return Math.min(100, Math.round(15 * 1.7 ** (attempt - 1)))
}
