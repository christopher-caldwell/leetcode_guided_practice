export class ListNode {
  constructor(
    public val: number,
    public next: ListNode | null = null,
  ) {}
}

export function hasCycle(head: ListNode | null): boolean {
  // Node identity, not value equality, is the observable fact.
  // Derive what different traversal rates imply in acyclic and cyclic structures.
  // List every null condition needed before advancing references safely.
  void head
  throw new Error('TODO: detect a cycle with constant auxiliary space')
}
