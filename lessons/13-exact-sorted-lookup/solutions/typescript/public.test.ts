import { describe, expect, it } from 'vitest'
import { binarySearch } from './solution.js'

describe('binarySearch public examples', () => {
  it('finds an exact value', () => {
    expect(binarySearch([-2, 0, 4, 9], 4)).toBe(2)
  })

  it('returns -1 when absent', () => {
    expect(binarySearch([1, 3], 2)).toBe(-1)
  })

  it('finds values at both boundaries', () => {
    expect(binarySearch([-10, -2, 0, 8, 90], -10)).toBe(0)
    expect(binarySearch([-10, -2, 0, 8, 90], 90)).toBe(4)
  })

  it('handles empty input without mutating values', () => {
    expect(binarySearch([], 1)).toBe(-1)
    const values = [-3, 1, 8]
    binarySearch(values, 1)
    expect(values).toEqual([-3, 1, 8])
  })
})
