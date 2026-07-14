import { describe, expect, it } from 'vitest'
import { topKFrequent } from './solution.js'

describe('topKFrequent public examples', () => {
  it('returns the two most frequent values', () => {
    expect(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('handles a single distinct value', () => {
    expect(topKFrequent([4], 1)).toEqual([4])
  })
})
