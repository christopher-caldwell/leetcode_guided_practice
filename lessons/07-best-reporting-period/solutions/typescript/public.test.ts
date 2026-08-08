import { describe, expect, it } from 'vitest'
import { maxWindowSum } from './learner_solution.js'

describe('maxWindowSum public examples', () => {
  it('finds the best fixed window', () => {
    expect(maxWindowSum([2, 1, 5, 1, 3], 3)).toBe(9)
  })

  it('allows a negative maximum', () => {
    expect(maxWindowSum([-4, -2], 1)).toBe(-2)
  })

  it('rejects invalid window sizes', () => {
    expect(maxWindowSum([], 1)).toBeNull()
    expect(maxWindowSum([1], 0)).toBeNull()
    expect(maxWindowSum([1], 2)).toBeNull()
  })

  it('uses the entire input when the window has its full length', () => {
    expect(maxWindowSum([5, 4], 2)).toBe(9)
  })
})
