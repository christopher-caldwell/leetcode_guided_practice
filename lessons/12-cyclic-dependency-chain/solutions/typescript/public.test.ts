import { describe, expect, it } from 'vitest'
import { hasCycle, ListNode } from './solution.js'

describe('hasCycle public examples', () => {
  it('detects a cycle', () => {
    const first = new ListNode(1)
    const second = new ListNode(2)
    const third = new ListNode(3)
    first.next = second
    second.next = third
    third.next = second
    expect(hasCycle(first)).toBe(true)
  })

  it('accepts an acyclic list', () => {
    expect(hasCycle(new ListNode(1, new ListNode(2)))).toBe(false)
  })
})
