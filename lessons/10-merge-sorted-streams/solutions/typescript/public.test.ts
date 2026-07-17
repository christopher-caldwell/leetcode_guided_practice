import { describe, expect, it } from 'vitest'
import { ListNode, mergeSortedStreams } from './solution.js'

const list = (...values: number[]): ListNode | null =>
  values.reduceRight<ListNode | null>((next, value) => new ListNode(value, next), null)

const values = (head: ListNode | null): number[] => {
  const result: number[] = []
  while (head) {
    result.push(head.val)
    head = head.next
  }
  return result
}

describe('mergeSortedStreams public examples', () => {
  it('merges both streams in order', () => {
    expect(values(mergeSortedStreams(list(1, 2, 4), list(1, 3, 4)))).toEqual([1, 1, 2, 3, 4, 4])
  })

  it('returns the nonempty stream', () => {
    expect(values(mergeSortedStreams(null, list(0)))).toEqual([0])
  })

  it('handles two empty streams', () => {
    expect(mergeSortedStreams(null, null)).toBeNull()
  })

  it('merges negative, duplicate, and uneven streams', () => {
    expect(values(mergeSortedStreams(list(-5, 2, 2), list(-4, 9)))).toEqual([-5, -4, 2, 2, 9])
  })
})
