import { describe, expect, it } from 'vitest'
import { longestUniqueRun } from './solution.js'

describe('longestUniqueRun public examples', () => {
  it('finds the longest unique contiguous segment', () => {
    expect(longestUniqueRun(['a', 'b', 'c', 'a', 'b'])).toBe(3)
  })

  it('handles an immediate duplicate', () => {
    expect(longestUniqueRun(['x', 'x'])).toBe(1)
  })
})
