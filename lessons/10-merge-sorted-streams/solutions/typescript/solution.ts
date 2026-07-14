export class ListNode {
  constructor(
    public val: number,
    public next: ListNode | null = null,
  ) {}
}

export function mergeSortedStreams(
  first: ListNode | null,
  second: ListNode | null,
): ListNode | null {
  // Identify the only two candidates for the next output node.
  // Define what the output tail and each input reference mean after every attachment.
  // Preserve access to all unconsumed nodes while relinking existing nodes.
  void first
  void second
  throw new Error('TODO: merge the sorted linked lists')
}
