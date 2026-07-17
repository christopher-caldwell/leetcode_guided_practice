import { describe, expect, it } from 'vitest'
import { maxDepth, TreeNode } from './solution.js'

describe('maxDepth public examples', () => {
  it('counts nodes on the longest path', () => {
    expect(maxDepth(new TreeNode(1, new TreeNode(2), new TreeNode(3)))).toBe(2)
  })

  it('returns zero for an empty tree', () => {
    expect(maxDepth(null)).toBe(0)
  })

  it('chooses the longer child path', () => {
    const root = new TreeNode(1, new TreeNode(2, new TreeNode(3)), new TreeNode(4))
    expect(maxDepth(root)).toBe(3)
  })

  it('handles a right-skewed tree', () => {
    expect(maxDepth(new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3))))).toBe(3)
  })

  it('does not confuse node values with depth', () => {
    expect(maxDepth(new TreeNode(-100, new TreeNode(999)))).toBe(2)
  })
})
