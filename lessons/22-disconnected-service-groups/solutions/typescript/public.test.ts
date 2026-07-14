import { describe, expect, it } from 'vitest'
import { countServiceGroups } from './solution.js'

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
})
