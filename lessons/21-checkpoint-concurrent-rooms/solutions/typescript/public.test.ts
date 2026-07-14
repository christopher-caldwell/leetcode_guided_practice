import { describe, expect, it } from 'vitest'
import { minimumConcurrentRooms } from './solution.js'

describe('minimumConcurrentRooms public examples', () => {
  it('returns peak room demand', () => {
    expect(
      minimumConcurrentRooms([
        [0, 30],
        [5, 10],
        [15, 20],
      ]),
    ).toBe(2)
  })

  it('reuses a room at an equal endpoint', () => {
    expect(
      minimumConcurrentRooms([
        [7, 10],
        [10, 12],
      ]),
    ).toBe(1)
  })
})
