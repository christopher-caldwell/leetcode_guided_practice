import { describe, expect, it } from 'vitest'
import { mergeWindows } from './solution.js'

describe('mergeWindows public examples', () => {
  it('merges overlapping windows', () => {
    expect(
      mergeWindows([
        [1, 3],
        [2, 6],
        [8, 10],
      ]),
    ).toEqual([
      [1, 6],
      [8, 10],
    ])
  })

  it('merges touching endpoints', () => {
    expect(
      mergeWindows([
        [1, 4],
        [4, 5],
      ]),
    ).toEqual([[1, 5]])
  })
})
