import { describe, expect, it } from 'vitest'
import { firstAtLeast } from './solution.js'

describe('firstAtLeast public examples', () => {
  it('returns the first duplicate meeting the threshold', () => {
    expect(firstAtLeast([1, 3, 3, 7], 3)).toBe(1)
  })

  it('returns -1 when no value qualifies', () => {
    expect(firstAtLeast([1, 2], 5)).toBe(-1)
  })

  it('returns zero when every value qualifies', () => {
    expect(firstAtLeast([1, 1, 4, 9], 1)).toBe(0)
    expect(firstAtLeast([1, 1, 4, 9], -5)).toBe(0)
  })

  it('handles empty input and a threshold between values', () => {
    expect(firstAtLeast([], 0)).toBe(-1)
    expect(firstAtLeast([1, 1, 4, 9], 2)).toBe(2)
  })
})
