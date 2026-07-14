import { MinPriorityQueue } from './support.js'

export function topKFrequent(values: number[], k: number): number[] {
  // Separate the cost of producing frequencies from the cost of selecting among distinct values.
  // Decide which candidate should be exposed by a bounded priority queue when it grows past k.
  // State the heap-size invariant and derive complexity using distinct-value count u.
  void MinPriorityQueue
  void values
  void k
  throw new Error('TODO: select the top-k frequent values')
}
