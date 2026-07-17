import { describe, expect, it } from 'vitest'
import { sameInventory } from './solution.js'

describe('sameInventory public examples', () => {
  it('ignores order but preserves multiplicity', () => {
    expect(sameInventory(['a', 'b', 'a'], ['b', 'a', 'a'])).toBe(true)
  })

  it('rejects a missing duplicate', () => {
    expect(sameInventory(['a', 'a'], ['a'])).toBe(false)
  })

  it('rejects extra items in the second inventory', () => {
    expect(sameInventory(['a'], ['a', 'a'])).toBe(false)
    expect(sameInventory(['a'], ['a', 'b'])).toBe(false)
  })

  it('rejects different counts when both inventories have the same length', () => {
    expect(sameInventory(['a', 'a', 'b'], ['a', 'b', 'b'])).toBe(false)
    expect(sameInventory(['a', 'b', 'b'], ['a', 'a', 'b'])).toBe(false)
  })

  it('handles empty inventories and preserves both inputs', () => {
    expect(sameInventory([], [])).toBe(true)
    const first = ['b', 'a']
    const second = ['a', 'b']
    sameInventory(first, second)
    expect(first).toEqual(['b', 'a'])
    expect(second).toEqual(['a', 'b'])
  })
})
