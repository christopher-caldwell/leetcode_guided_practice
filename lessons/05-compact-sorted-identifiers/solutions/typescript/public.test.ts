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

  it('keeps an already-distinct array unchanged', () => {
    const ids = [-2, 0, 4]
    expect(compactSortedIds(ids)).toBe(3)
    expect(ids).toEqual([-2, 0, 4])
  })

  it('compacts several duplicate runs into the exact prefix', () => {
    const ids = [-2, -2, 0, 0, 0, 4, 4]
    const length = compactSortedIds(ids)
    expect(length).toBe(3)
    expect(ids.slice(0, length)).toEqual([-2, 0, 4])
  })
})
