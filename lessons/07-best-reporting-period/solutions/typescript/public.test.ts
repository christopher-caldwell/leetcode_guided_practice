import { describe, expect, it } from 'vitest'
import { maxWindowSum } from './solution.js'

describe('maxWindowSum public examples', () => {
  it('finds the best fixed window', () => {
    expect(maxWindowSum([2, 1, 5, 1, 3], 3)).toBe(9)
  })

  it('allows a negative maximum', () => {
    expect(maxWindowSum([-4, -2], 1)).toBe(-2)
  })
})
