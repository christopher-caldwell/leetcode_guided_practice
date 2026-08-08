import { describe, expect, it } from 'vitest'
import { topKFrequent } from './learner_solution.js'

describe('topKFrequent public examples', () => {
  it('returns the two most frequent values', () => {
    expect(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('handles a single distinct value', () => {
    expect(topKFrequent([4], 1)).toEqual([4])
  })

  it('can retain every distinct value', () => {
    expect(topKFrequent([1, 2, 3], 3).sort((a, b) => a - b)).toEqual([1, 2, 3])
  })

  it('accepts either value tied at the cutoff without duplicates', () => {
    const result = topKFrequent([1, 1, 2, 2, 3], 1)
    expect(result).toHaveLength(1)
    expect(new Set(result).size).toBe(1)
    expect([1, 2]).toContain(result[0])
  })
})
