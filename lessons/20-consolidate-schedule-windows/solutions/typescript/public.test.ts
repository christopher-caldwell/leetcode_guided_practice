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

  it('merges nested windows supplied out of order', () => {
    expect(
      mergeWindows([
        [8, 10],
        [1, 9],
        [2, 3],
        [20, 21],
      ]),
    ).toEqual([
      [1, 10],
      [20, 21],
    ])
  })

  it('handles empty input and preserves nested input tuples', () => {
    expect(mergeWindows([])).toEqual([])
    const windows: Array<[number, number]> = [
      [5, 7],
      [1, 2],
    ]
    mergeWindows(windows)
    expect(windows).toEqual([
      [5, 7],
      [1, 2],
    ])
  })
})
