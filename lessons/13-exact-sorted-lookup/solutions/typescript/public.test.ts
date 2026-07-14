import { describe, expect, it } from 'vitest'
import { binarySearch } from './solution.js'

describe('binarySearch public examples', () => {
  it('finds an exact value', () => {
    expect(binarySearch([-2, 0, 4, 9], 4)).toBe(2)
  })

  it('returns -1 when absent', () => {
    expect(binarySearch([1, 3], 2)).toBe(-1)
  })
})
