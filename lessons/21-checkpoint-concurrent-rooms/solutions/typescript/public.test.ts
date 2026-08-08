import { describe, expect, it } from 'vitest'
import { minimumConcurrentRooms } from './learner_solution.js'

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

  it('tracks the peak rather than the final active count', () => {
    expect(
      minimumConcurrentRooms([
        [1, 10],
        [2, 9],
        [3, 8],
        [20, 21],
      ]),
    ).toBe(3)
  })

  it('handles empty input and preserves meeting order', () => {
    expect(minimumConcurrentRooms([])).toBe(0)
    const meetings: Array<[number, number]> = [
      [5, 6],
      [1, 3],
    ]
    minimumConcurrentRooms(meetings)
    expect(meetings).toEqual([
      [5, 6],
      [1, 3],
    ])
  })
})
