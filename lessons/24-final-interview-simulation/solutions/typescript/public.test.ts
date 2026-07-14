import { describe, expect, it } from 'vitest'
import { shortestRoute, smallestCoveringRange } from './solution.js'

describe('final simulation public examples', () => {
  it('finds the smallest covering event range', () => {
    expect(smallestCoveringRange(['a', 'b', 'c', 'a'], ['a', 'c'])).toEqual([2, 3])
  })

  it('finds the shortest route by edge count', () => {
    expect(
      shortestRoute(
        5,
        [
          [0, 1],
          [1, 2],
          [0, 3],
        ],
        3,
        2,
      ),
    ).toBe(3)
  })
})
