import { describe, expect, it } from 'vitest'
import { pairSumAtScale } from './solution.js'

describe('pairSumAtScale public examples', () => {
  it('returns the matching indices', () => {
    expect(pairSumAtScale([3, 2, 4], 6)).toEqual([1, 2])
  })

  it('handles duplicate values at distinct indices', () => {
    expect(pairSumAtScale([3, 3], 6)).toEqual([0, 1])
  })
})
