import { describe, expect, it } from 'vitest'
import { countServiceGroups } from './learner_solution.js'

describe('countServiceGroups public examples', () => {
  it('counts connected groups', () => {
    expect(
      countServiceGroups(5, [
        [0, 1],
        [1, 2],
        [3, 4],
      ]),
    ).toBe(2)
  })

  it('counts isolated services', () => {
    expect(countServiceGroups(3, [])).toBe(3)
  })

  it('handles zero services', () => {
    expect(countServiceGroups(0, [])).toBe(0)
  })

  it('tolerates duplicate, reversed, and self connections', () => {
    expect(
      countServiceGroups(3, [
        [0, 1],
        [1, 0],
        [2, 2],
      ]),
    ).toBe(2)
  })
})
