import { describe, expect, it } from 'vitest'
import { pairSumBaseline } from './learner_solution.js'

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

describe('pairSumBaseline public examples', () => {
  it('finds a pair', () => {
    expectValidPair(pairSumBaseline([2, 7, 11], 9), [2, 7, 11], 9)
  })

  it('does not reuse one index', () => {
    expect(pairSumBaseline([3], 6)).toBeNull()
  })

  it('uses distinct duplicate values when they form the pair', () => {
    expectValidPair(pairSumBaseline([6, 6], 12), [6, 6], 12)
  })

  it('reports empty and impossible inputs', () => {
    expect(pairSumBaseline([], 0)).toBeNull()
    expect(pairSumBaseline([1, 2, 4], 20)).toBeNull()
  })
})
