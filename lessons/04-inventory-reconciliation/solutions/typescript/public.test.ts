import { describe, expect, it } from 'vitest'
import { sameInventory } from './solution.js'

describe('sameInventory public examples', () => {
  it('ignores order but preserves multiplicity', () => {
    expect(sameInventory(['a', 'b', 'a'], ['b', 'a', 'a'])).toBe(true)
  })

  it('rejects a missing duplicate', () => {
    expect(sameInventory(['a', 'a'], ['a'])).toBe(false)
  })
})
