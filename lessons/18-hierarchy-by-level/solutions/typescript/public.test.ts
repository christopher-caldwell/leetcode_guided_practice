import { describe, expect, it } from 'vitest'
import { levelOrder, TreeNode } from './learner_solution.js'

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

  it('keeps values in left-to-right order within each level', () => {
    const root = new TreeNode(1, new TreeNode(2, null, new TreeNode(4)), new TreeNode(3))
    expect(levelOrder(root)).toEqual([[1], [2, 3], [4]])
  })

  it('handles a skewed tree', () => {
    expect(levelOrder(new TreeNode(1, new TreeNode(2, new TreeNode(3))))).toEqual([[1], [2], [3]])
  })

  it('keeps duplicate node values as separate entries', () => {
    expect(levelOrder(new TreeNode(1, new TreeNode(1), new TreeNode(1)))).toEqual([[1], [1, 1]])
  })
})
