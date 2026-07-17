import { describe, expect, it } from 'vitest'
import { longestStableSegment } from './solution.js'

describe('longestStableSegment public examples', () => {
  it('finds the longest permitted segment', () => {
    expect(longestStableSegment(['a', 'b', 'a', 'c'], 2)).toBe(3)
  })

  it('handles one repeated kind', () => {
    expect(longestStableSegment(['a', 'a'], 1)).toBe(2)
  })

  it('shrinks repeatedly until the distinct-kind limit is restored', () => {
    expect(longestStableSegment(['a', 'b', 'c', 'b', 'b', 'c'], 2)).toBe(5)
  })

  it('handles empty input and nonpositive limits', () => {
    expect(longestStableSegment([], 2)).toBe(0)
    expect(longestStableSegment(['a'], 0)).toBe(0)
    expect(longestStableSegment(['a'], -1)).toBe(0)
  })
})
