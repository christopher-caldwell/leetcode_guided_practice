export class TreeNode {
  constructor(
    public val: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}

export function levelOrder(root: TreeNode | null): number[][] {
  // Explain why the required output order differs from a depth-first call stack.
  // Define which queued nodes belong to the current level before adding their children.
  // Account for queue operations in the complexity analysis, not only node visits.
  void root
  throw new Error('TODO: traverse the hierarchy by level')
}
