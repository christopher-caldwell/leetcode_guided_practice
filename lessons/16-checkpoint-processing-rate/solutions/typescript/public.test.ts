import { describe, expect, it } from 'vitest'
import { minimumProcessingRate } from './solution.js'

describe('minimumProcessingRate public examples', () => {
  it('finds the minimum feasible rate', () => {
    expect(minimumProcessingRate([3, 6, 7, 11], 8)).toBe(4)
  })

  it('accounts for partial hours', () => {
    expect(minimumProcessingRate([30], 5)).toBe(6)
  })
})
