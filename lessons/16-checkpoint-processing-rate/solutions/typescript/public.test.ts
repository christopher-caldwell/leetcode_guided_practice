import { describe, expect, it } from 'vitest'
import { minimumProcessingRate } from './learner_solution.js'

describe('minimumProcessingRate public examples', () => {
  it('finds the minimum feasible rate', () => {
    expect(minimumProcessingRate([3, 6, 7, 11], 8)).toBe(4)
  })

  it('accounts for partial hours', () => {
    expect(minimumProcessingRate([30], 5)).toBe(6)
  })

  it('returns one when abundant hours permit the minimum rate', () => {
    expect(minimumProcessingRate([1, 1, 1], 100)).toBe(1)
  })

  it('handles multiple large workloads with a tight deadline', () => {
    expect(minimumProcessingRate([1_000_000_000, 1_000_000_000], 3)).toBe(1_000_000_000)
  })
})
