import { describe, expect, it } from 'vitest'
import { findFirstIndex } from './solution.js'

describe('findFirstIndex public examples', () => {
  it('returns the first matching index', () => {
    expect(findFirstIndex([4, 8, 4], 4)).toBe(0)
  })

  it('returns -1 when absent', () => {
    expect(findFirstIndex([4, 8], 3)).toBe(-1)
  })
})
