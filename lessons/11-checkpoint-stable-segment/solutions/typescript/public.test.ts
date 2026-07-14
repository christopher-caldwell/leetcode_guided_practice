import { describe, expect, it } from 'vitest'
import { longestStableSegment } from './solution.js'

describe('longestStableSegment public examples', () => {
  it('finds the longest permitted segment', () => {
    expect(longestStableSegment(['a', 'b', 'a', 'c'], 2)).toBe(3)
  })

  it('handles one repeated kind', () => {
    expect(longestStableSegment(['a', 'a'], 1)).toBe(2)
  })
})
