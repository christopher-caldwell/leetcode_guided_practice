import { describe, expect, it } from 'vitest'
import { hasNearbyRepeat } from './solution.js'

describe('hasNearbyRepeat public examples', () => {
  it('detects a repeat within the distance', () => {
    expect(hasNearbyRepeat(['login', 'view', 'login'], 2)).toBe(true)
  })

  it('rejects a repeat beyond the distance', () => {
    expect(hasNearbyRepeat(['a', 'b', 'a'], 1)).toBe(false)
  })
})
