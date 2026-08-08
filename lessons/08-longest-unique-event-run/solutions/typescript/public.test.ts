import { describe, expect, it } from 'vitest'
import { longestUniqueRun } from './learner_solution.js'

describe('longestUniqueRun public examples', () => {
  it('finds the longest unique contiguous segment', () => {
    expect(longestUniqueRun(['a', 'b', 'c', 'a', 'b'])).toBe(3)
  })

  it('handles an immediate duplicate', () => {
    expect(longestUniqueRun(['x', 'x'])).toBe(1)
  })

  it('ignores a previous occurrence outside the current window', () => {
    expect(longestUniqueRun(['a', 'b', 'b', 'a', 'c'])).toBe(3)
  })

  it('handles empty input and preserves the event stream', () => {
    expect(longestUniqueRun([])).toBe(0)
    const events = ['c', 'a', 'b', 'a']
    longestUniqueRun(events)
    expect(events).toEqual(['c', 'a', 'b', 'a'])
  })
})
