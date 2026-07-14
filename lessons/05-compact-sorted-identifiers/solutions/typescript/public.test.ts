import { describe, expect, it } from 'vitest'
import { compactSortedIds } from './solution.js'

describe('compactSortedIds public examples', () => {
  it('writes unique values into the returned prefix', () => {
    const ids = [1, 1, 2]
    const length = compactSortedIds(ids)
    expect(length).toBe(2)
    expect(ids.slice(0, length)).toEqual([1, 2])
  })

  it('handles empty input', () => {
    expect(compactSortedIds([])).toBe(0)
  })
})
