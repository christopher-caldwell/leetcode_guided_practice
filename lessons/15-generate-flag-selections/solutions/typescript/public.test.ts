import { describe, expect, it } from 'vitest'
import { generateSubsets } from './solution.js'

const normalized = (sets: number[][]): string[] =>
  sets.map((set) => [...set].sort((a, b) => a - b).join(',')).sort()

describe('generateSubsets public examples', () => {
  it('generates every selection', () => {
    expect(normalized(generateSubsets([1, 2]))).toEqual(['', '1', '1,2', '2'])
  })

  it('includes the empty selection for empty input', () => {
    expect(generateSubsets([])).toEqual([[]])
  })

  it('generates all eight unique subsets of three values', () => {
    const subsets = generateSubsets([1, 2, 3])
    expect(normalized(subsets)).toEqual(['', '1', '1,2', '1,2,3', '1,3', '2', '2,3', '3'])
  })

  it('preserves input and returns independent subset arrays', () => {
    const values = [3, 1]
    const subsets = generateSubsets(values)
    expect(values).toEqual([3, 1])
    expect(new Set(subsets).size).toBe(subsets.length)
  })
})
