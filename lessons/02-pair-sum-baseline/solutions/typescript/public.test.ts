import { describe, expect, it } from 'vitest'
import { pairSumBaseline } from './solution.js'

describe('pairSumBaseline public examples', () => {
  it('finds a pair', () => {
    expect(pairSumBaseline([2, 7, 11], 9)).toEqual([0, 1])
  })

  it('does not reuse one index', () => {
    expect(pairSumBaseline([3], 6)).toBeNull()
  })
})
