import { describe, expect, it } from 'vitest'
import { maxNonAdjacentValue } from './learner_solution.js'

describe('maxNonAdjacentValue public examples', () => {
  it('chooses the best non-adjacent combination', () => {
    expect(maxNonAdjacentValue([2, 7, 9, 3, 1])).toBe(12)
  })

  it('allows selecting nothing', () => {
    expect(maxNonAdjacentValue([-2, -1])).toBe(0)
  })

  it('chooses separated boundary values over a local middle choice', () => {
    expect(maxNonAdjacentValue([5, 1, 1, 5])).toBe(10)
  })

  it('handles empty and singleton input without mutation', () => {
    expect(maxNonAdjacentValue([])).toBe(0)
    const values = [7]
    expect(maxNonAdjacentValue(values)).toBe(7)
    expect(values).toEqual([7])
  })
})
