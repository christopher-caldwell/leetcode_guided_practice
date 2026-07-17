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

  it('honors required multiplicity and earliest-start ties', () => {
    expect(smallestCoveringRange(['a', 'x', 'a', 'b', 'a'], ['a', 'a', 'b'])).toEqual([2, 4])
    expect(smallestCoveringRange(['a', 'b', 'a', 'b'], ['a', 'b'])).toEqual([0, 1])
  })

  it('reports impossible ranges and routes', () => {
    expect(smallestCoveringRange(['a', 'b'], ['z'])).toBeNull()
    expect(smallestCoveringRange(['a'], [])).toBeNull()
    expect(shortestRoute(4, [[0, 1]], 0, 3)).toBe(-1)
  })

  it('returns zero when a route starts at its destination', () => {
    expect(shortestRoute(2, [], 1, 1)).toBe(0)
  })
})
