import { describe, expect, it } from 'vitest'
import { hasNearbyRepeat } from './solution.js'

describe('hasNearbyRepeat public examples', () => {
  it('detects a repeat within the distance', () => {
    expect(hasNearbyRepeat(['login', 'view', 'login'], 2)).toBe(true)
  })

  it('rejects a repeat beyond the distance', () => {
    expect(hasNearbyRepeat(['a', 'b', 'a'], 1)).toBe(false)
  })

  it('uses the most recent occurrence of an event', () => {
    expect(hasNearbyRepeat(['a', 'b', 'a', 'a'], 1)).toBe(true)
  })

  it('handles zero distance and preserves the event stream', () => {
    const events = ['a', 'a']
    expect(hasNearbyRepeat(events, 0)).toBe(false)
    expect(events).toEqual(['a', 'a'])
    expect(hasNearbyRepeat([], 4)).toBe(false)
  })
})
