import { describe, expect, it } from 'vitest'
import { pairSumAtScale } from './solution.js'

function expectValidPair(result: [number, number] | null, values: number[], target: number): void {
  expect(result).not.toBeNull()
  const [left, right] = result!
  expect(left).not.toBe(right)
  expect(left).toBeGreaterThanOrEqual(0)
  expect(right).toBeGreaterThanOrEqual(0)
  expect(left).toBeLessThan(values.length)
  expect(right).toBeLessThan(values.length)
  expect(values[left]! + values[right]!).toBe(target)
}

describe('pairSumAtScale public examples', () => {
  it('returns the matching indices', () => {
    expectValidPair(pairSumAtScale([3, 2, 4], 6), [3, 2, 4], 6)
  })

  it('handles duplicate values at distinct indices', () => {
    expectValidPair(pairSumAtScale([3, 3], 6), [3, 3], 6)
  })

  it('finds a pair containing negative values', () => {
    expectValidPair(pairSumAtScale([-8, 4, 10, 2], 6), [-8, 4, 10, 2], 6)
  })

  it('returns null when no pair exists', () => {
    expect(pairSumAtScale([], 0)).toBeNull()
    expect(pairSumAtScale([1, 2, 4], 50)).toBeNull()
  })
})
