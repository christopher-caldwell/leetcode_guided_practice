import { describe, expect, it } from 'vitest'
import { maxDepth, TreeNode } from './solution.js'

describe('maxDepth public examples', () => {
  it('counts nodes on the longest path', () => {
    expect(maxDepth(new TreeNode(1, new TreeNode(2), new TreeNode(3)))).toBe(2)
  })

  it('returns zero for an empty tree', () => {
    expect(maxDepth(null)).toBe(0)
  })
})
