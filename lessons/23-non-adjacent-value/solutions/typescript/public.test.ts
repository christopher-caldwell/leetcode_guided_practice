import { describe, expect, it } from 'vitest'
import { maxNonAdjacentValue } from './solution.js'

describe('maxNonAdjacentValue public examples', () => {
  it('chooses the best non-adjacent combination', () => {
    expect(maxNonAdjacentValue([2, 7, 9, 3, 1])).toBe(12)
  })

  it('allows selecting nothing', () => {
    expect(maxNonAdjacentValue([-2, -1])).toBe(0)
  })
})
