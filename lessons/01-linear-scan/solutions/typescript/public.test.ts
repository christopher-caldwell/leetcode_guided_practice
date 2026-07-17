import { describe, expect, it } from 'vitest'
import { findFirstIndex } from './solution.js'

describe('findFirstIndex public examples', () => {
  it('returns the first matching index', () => {
    expect(findFirstIndex([4, 8, 4], 4)).toBe(0)
  })

  it('returns -1 when absent', () => {
    expect(findFirstIndex([4, 8], 3)).toBe(-1)
  })

  it('handles empty input and negative values', () => {
    expect(findFirstIndex([], 1)).toBe(-1)
    expect(findFirstIndex([-3, 2, -3], -3)).toBe(0)
  })

  it('does not mutate the input', () => {
    const values = [5, 1, 5]
    findFirstIndex(values, 5)
    expect(values).toEqual([5, 1, 5])
  })
})
