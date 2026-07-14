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
})
