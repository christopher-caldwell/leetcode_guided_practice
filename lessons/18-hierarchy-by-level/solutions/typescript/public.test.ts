import { describe, expect, it } from 'vitest'
import { levelOrder, TreeNode } from './solution.js'

describe('levelOrder public examples', () => {
  it('groups values by level', () => {
    const root = new TreeNode(
      3,
      new TreeNode(9),
      new TreeNode(20, new TreeNode(15), new TreeNode(7)),
    )
    expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]])
  })

  it('handles an empty tree', () => {
    expect(levelOrder(null)).toEqual([])
  })
})
