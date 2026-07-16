import { describe, expect, it } from 'vitest'

type Module = Record<string, any>

export function registerVerifier(id: string, subject: Module): void {
  const verifier = verifiers[id]
  if (!verifier) throw new Error(`No TypeScript verifier registered for ${id}`)
  describe(`${id} internal verifier`, () => verifier(subject))
}

const verifiers: Record<string, (subject: Module) => void> = {
  '01-linear-scan': ({ findFirstIndex }) => {
    it('[correctness] handles duplicates, absence, negatives, and empty input', () => {
      expect(findFirstIndex([-3, 2, -3], -3)).toBe(0)
      expect(findFirstIndex([9, 4, 7], 4)).toBe(1)
      expect(findFirstIndex([1, 2, 3], 9)).toBe(-1)
      expect(findFirstIndex([], 1)).toBe(-1)
    })
    it('[contract] does not mutate input', () => {
      const input = [5, 1, 5]
      const before = [...input]
      findFirstIndex(input, 5)
      expect(input).toEqual(before)
    })
    it('[complexity] stops at the first match', () => {
      let reads = 0
      const input = countedArray(
        [8, ...Array.from({ length: 10_000 }, (_, index) => index)],
        () => reads++,
      )
      expect(findFirstIndex(input, 8)).toBe(0)
      expect(reads).toBeLessThan(20)
    })
  },
  '02-pair-sum-baseline': ({ pairSumBaseline }) => {
    it('[correctness] searches distinct pairs and reports impossibility', () => {
      expect(pairSumBaseline([-4, 8, 3], -1)).toEqual([0, 2])
      expectValidPair(pairSumBaseline([99, 2, 7], 9), [99, 2, 7], 9)
      expect(pairSumBaseline([5], 10)).toBeNull()
      expect(pairSumBaseline([], 0)).toBeNull()
    })
    it('[edge-case] handles duplicate values at different indices', () => {
      expect(pairSumBaseline([6, 6], 12)).toEqual([0, 1])
    })
    it('[contract] preserves the input array', () => {
      const nums = [2, 9, 4]
      const before = [...nums]
      pairSumBaseline(nums, 13)
      expect(nums).toEqual(before)
    })
  },
  '03-pair-sum-at-scale': ({ pairSumAtScale }) => {
    it('[correctness] returns valid original indices or null', () => {
      expectValidPair(pairSumAtScale([-8, 4, 10, 2], 6), [-8, 4, 10, 2], 6)
      expect(pairSumAtScale([1, 2, 4], 50)).toBeNull()
    })
    it('[edge-case] uses distinct indices for duplicate values', () => {
      expectValidPair(pairSumAtScale([0, 0], 0), [0, 0], 0)
    })
    it('[complexity] scales with the input rather than all index pairs', () => {
      let reads = 0
      const raw = Array.from({ length: 4_000 }, (_, index) => index * 2)
      const nums = countedArray(raw, () => reads++)
      expect(pairSumAtScale(nums, -3)).toBeNull()
      expect(reads).toBeLessThan(40_000)
    })
  },
  '04-inventory-reconciliation': ({ sameInventory }) => {
    it('[correctness] compares multiplicities independent of order', () => {
      expect(sameInventory(['x', 'x', 'y'], ['y', 'x', 'x'])).toBe(true)
      expect(sameInventory(['x', 'y'], ['x', 'x'])).toBe(false)
      expect(sameInventory([], [])).toBe(true)
    })
    it('[edge-case] treats identifiers as case-sensitive', () => {
      expect(sameInventory(['A'], ['a'])).toBe(false)
    })
    it('[contract] does not reorder either input', () => {
      const first = ['b', 'a']
      const second = ['a', 'b']
      sameInventory(first, second)
      expect(first).toEqual(['b', 'a'])
      expect(second).toEqual(['a', 'b'])
    })
  },
  '05-compact-sorted-identifiers': ({ compactSortedIds }) => {
    it('[correctness] writes the exact distinct prefix', () => {
      const ids = [-2, -2, 0, 0, 0, 4]
      const length = compactSortedIds(ids)
      expect(length).toBe(3)
      expect(ids.slice(0, length)).toEqual([-2, 0, 4])
    })
    it('[edge-case] handles empty and already-distinct arrays', () => {
      expect(compactSortedIds([])).toBe(0)
      const ids = [1, 2, 3]
      expect(compactSortedIds(ids)).toBe(3)
      expect(ids).toEqual([1, 2, 3])
    })
    it('[complexity] compacts a large distinct input in one pass', () => {
      let reads = 0
      const ids = guardedArray(
        Array.from({ length: 20_000 }, (_, index) => index),
        () => reads++,
        100_000,
      )
      expect(compactSortedIds(ids)).toBe(20_000)
      expect(reads).toBeLessThan(100_000)
    })
  },
  '06-checkpoint-nearby-events': ({ hasNearbyRepeat }) => {
    it('[correctness] evaluates index distance and latest repetitions', () => {
      expect(hasNearbyRepeat(['a', 'b', 'c', 'a'], 3)).toBe(true)
      expect(hasNearbyRepeat(['a', 'b', 'a', 'a'], 1)).toBe(true)
      expect(hasNearbyRepeat(['a', 'b', 'c', 'a'], 2)).toBe(false)
    })
    it('[edge-case] handles zero distance and empty input', () => {
      expect(hasNearbyRepeat(['a', 'a'], 0)).toBe(false)
      expect(hasNearbyRepeat([], 4)).toBe(false)
    })
    it('[complexity] handles a large nonrepeating stream', () => {
      const events = Array.from({ length: 40_000 }, (_, index) => `event-${index}`)
      expect(hasNearbyRepeat(events, 100)).toBe(false)
    })
  },
  '07-best-reporting-period': ({ maxWindowSum }) => {
    it('[correctness] evaluates every fixed-length window', () => {
      expect(maxWindowSum([1, 9, -4, 7, 3], 2)).toBe(10)
      expect(maxWindowSum([5, 4], 2)).toBe(9)
    })
    it('[edge-case] handles invalid sizes and all-negative values', () => {
      expect(maxWindowSum([], 1)).toBeNull()
      expect(maxWindowSum([1], 0)).toBeNull()
      expect(maxWindowSum([1], 2)).toBeNull()
      expect(maxWindowSum([-8, -3, -5], 2)).toBe(-8)
    })
    it('[contract] preserves input', () => {
      const values = [3, 1, 2]
      maxWindowSum(values, 2)
      expect(values).toEqual([3, 1, 2])
    })
    it('[complexity] updates adjacent windows instead of rescanning them', () => {
      let reads = 0
      const values = guardedArray(
        Array.from({ length: 8_000 }, (_, index) => (index % 17) - 8),
        () => reads++,
        40_000,
      )
      expect(maxWindowSum(values, 4_000)).toBeTypeOf('number')
      expect(reads).toBeLessThan(40_000)
    })
  },
  '08-longest-unique-event-run': ({ longestUniqueRun }) => {
    it('[correctness] handles a duplicate whose previous occurrence is outside the current window', () => {
      expect(longestUniqueRun(['a', 'b', 'b', 'a', 'c'])).toBe(3)
      expect(longestUniqueRun(['a', 'b', 'c', 'd'])).toBe(4)
    })
    it('[edge-case] handles empty and uniform streams', () => {
      expect(longestUniqueRun([])).toBe(0)
      expect(longestUniqueRun(['x', 'x', 'x'])).toBe(1)
    })
    it('[complexity] handles a long repeating stream', () => {
      const events = Array.from({ length: 60_000 }, (_, index) => String(index % 200))
      expect(longestUniqueRun(events)).toBe(200)
    })
  },
  '09-balanced-delimiters': ({ hasBalancedDelimiters }) => {
    it('[correctness] validates pairing and nesting order', () => {
      expect(hasBalancedDelimiters('{[()]}')).toBe(true)
      expect(hasBalancedDelimiters('{[(])}')).toBe(false)
      expect(hasBalancedDelimiters('(()')).toBe(false)
    })
    it('[edge-case] handles empty input and premature closers', () => {
      expect(hasBalancedDelimiters('')).toBe(true)
      expect(hasBalancedDelimiters(']')).toBe(false)
    })
  },
  '10-merge-sorted-streams': ({ mergeSortedStreams, ListNode }) => {
    it('[correctness] merges negative, duplicate, and uneven streams', () => {
      const result = mergeSortedStreams(makeList(ListNode, [-5, 2, 2]), makeList(ListNode, [-4, 9]))
      expect(listValues(result)).toEqual([-5, -4, 2, 2, 9])
    })
    it('[edge-case] handles two empty streams', () => {
      expect(mergeSortedStreams(null, null)).toBeNull()
    })
    it('[contract] reuses the supplied nodes', () => {
      const first = makeList(ListNode, [1, 3])
      const second = makeList(ListNode, [2, 4])
      const original = new Set(listNodes(first).concat(listNodes(second)))
      const result = mergeSortedStreams(first, second)
      expect(listNodes(result).every((node) => original.has(node))).toBe(true)
      expect(listNodes(result)).toHaveLength(4)
    })
  },
  '11-checkpoint-stable-segment': ({ longestStableSegment }) => {
    it('[correctness] retains at most the allowed distinct kinds', () => {
      expect(longestStableSegment(['a', 'b', 'c', 'b', 'b', 'c'], 2)).toBe(5)
      expect(longestStableSegment(['a', 'b', 'c'], 3)).toBe(3)
    })
    it('[edge-case] handles nonpositive limits and empty streams', () => {
      expect(longestStableSegment(['a'], 0)).toBe(0)
      expect(longestStableSegment([], 2)).toBe(0)
    })
    it('[complexity] scales to a long stream', () => {
      const events = Array.from({ length: 50_000 }, (_, index) => String(index % 5))
      expect(longestStableSegment(events, 5)).toBe(50_000)
    })
  },
  '12-cyclic-dependency-chain': ({ hasCycle, ListNode }) => {
    it('[correctness] detects interior and self cycles', () => {
      const one = new ListNode(1)
      const two = new ListNode(2)
      const three = new ListNode(3)
      one.next = two
      two.next = three
      three.next = two
      expect(hasCycle(one)).toBe(true)
      const self = new ListNode(9)
      self.next = self
      expect(hasCycle(self)).toBe(true)
    })
    it('[edge-case] accepts null and repeated values in acyclic nodes', () => {
      expect(hasCycle(null)).toBe(false)
      expect(hasCycle(new ListNode(1, new ListNode(1)))).toBe(false)
    })
    it('[contract] preserves node values and links', () => {
      const one = new ListNode(1)
      const two = new ListNode(2)
      const three = new ListNode(3)
      one.next = two
      two.next = three
      const before = [
        [one.val, one.next],
        [two.val, two.next],
        [three.val, three.next],
      ]
      expect(hasCycle(one)).toBe(false)
      expect([
        [one.val, one.next],
        [two.val, two.next],
        [three.val, three.next],
      ]).toEqual(before)
    })
    it('[complexity] traverses a long acyclic chain linearly', () => {
      let head: any = null
      for (let value = 0; value < 50_000; value += 1) head = new ListNode(value, head)
      expect(hasCycle(head)).toBe(false)
    })
  },
  '13-exact-sorted-lookup': ({ binarySearch }) => {
    it('[correctness] finds boundaries and reports absence', () => {
      expect(binarySearch([-10, -2, 0, 8, 90], -10)).toBe(0)
      expect(binarySearch([-10, -2, 0, 8, 90], 90)).toBe(4)
      expect(binarySearch([-10, -2, 0, 8, 90], 7)).toBe(-1)
      expect(binarySearch([], 1)).toBe(-1)
    })
    it('[complexity] uses logarithmic indexed access', () => {
      let reads = 0
      const values = countedArray(
        Array.from({ length: 1_000_000 }, (_, index) => index * 2),
        () => reads++,
      )
      expect(binarySearch(values, 1_500_000)).toBe(750_000)
      expect(reads).toBeLessThan(100)
    })
  },
  '14-first-eligible-record': ({ firstAtLeast }) => {
    it('[correctness] finds the first qualifying boundary', () => {
      expect(firstAtLeast([1, 1, 1, 4, 9], 1)).toBe(0)
      expect(firstAtLeast([1, 1, 1, 4, 9], 2)).toBe(3)
      expect(firstAtLeast([1, 1, 1, 4, 9], 10)).toBe(-1)
      expect(firstAtLeast([], 0)).toBe(-1)
    })
    it('[complexity] scales logarithmically', () => {
      let reads = 0
      const values = countedArray(
        Array.from({ length: 1_000_000 }, (_, index) => index),
        () => reads++,
      )
      expect(firstAtLeast(values, 777_777)).toBe(777_777)
      expect(reads).toBeLessThan(100)
    })
  },
  '15-generate-flag-selections': ({ generateSubsets }) => {
    it('[correctness] generates every subset once', () => {
      expect(normalizeSubsets(generateSubsets([1, 2, 3]))).toEqual(
        normalizeSubsets([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]),
      )
    })
    it('[edge-case] handles empty input and negative values', () => {
      expect(generateSubsets([])).toEqual([[]])
      expect(normalizeSubsets(generateSubsets([-1]))).toEqual(['', '-1'])
    })
    it('[contract] preserves the input', () => {
      const values = [3, 1]
      generateSubsets(values)
      expect(values).toEqual([3, 1])
    })
  },
  '16-checkpoint-processing-rate': ({ minimumProcessingRate }) => {
    it('[correctness] returns the smallest feasible integer rate', () => {
      expect(minimumProcessingRate([30, 11, 23, 4, 20], 5)).toBe(30)
      expect(minimumProcessingRate([30, 11, 23, 4, 20], 6)).toBe(23)
      expect(minimumProcessingRate([1, 1, 1], 100)).toBe(1)
    })
    it('[edge-case] handles large safe-integer workloads', () => {
      expect(minimumProcessingRate([1_000_000_000, 1_000_000_000], 3)).toBe(1_000_000_000)
    })
    it('[complexity] searches the candidate rate logarithmically', () => {
      let reads = 0
      const jobs = guardedArray(
        Array.from({ length: 32 }, () => 1_000_000_000),
        () => reads++,
        3_000,
      )
      expect(minimumProcessingRate(jobs, 32)).toBe(1_000_000_000)
      expect(reads).toBeLessThan(3_000)
    })
  },
  '17-hierarchy-depth': ({ maxDepth, TreeNode }) => {
    it('[correctness] chooses the longest child path', () => {
      const root = new TreeNode(1, new TreeNode(2, new TreeNode(3)), new TreeNode(4))
      expect(maxDepth(root)).toBe(3)
      expect(maxDepth(new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3))))).toBe(3)
    })
    it('[edge-case] handles empty trees and the documented skew limit', () => {
      expect(maxDepth(null)).toBe(0)
      let root: any = null
      for (let value = 0; value < 1_000; value += 1) root = new TreeNode(value, root)
      expect(maxDepth(root)).toBe(1_000)
    })
  },
  '18-hierarchy-by-level': ({ levelOrder, TreeNode }) => {
    it('[correctness] preserves level and left-to-right order', () => {
      const root = new TreeNode(1, new TreeNode(2, null, new TreeNode(4)), new TreeNode(3))
      expect(levelOrder(root)).toEqual([[1], [2, 3], [4]])
    })
    it('[edge-case] handles empty and skewed trees', () => {
      expect(levelOrder(null)).toEqual([])
      expect(levelOrder(new TreeNode(1, new TreeNode(2, new TreeNode(3))))).toEqual([[1], [2], [3]])
    })
    it('[complexity] traverses a broad tree without front-removal copying', () => {
      const nodes = Array.from({ length: 16_383 }, (_, value) => new TreeNode(value))
      for (let index = 0; index < 8_191; index += 1) {
        nodes[index]!.left = nodes[index * 2 + 1]!
        nodes[index]!.right = nodes[index * 2 + 2]!
      }
      const levels = levelOrder(nodes[0]!)
      expect(levels).toHaveLength(14)
      expect(levels.at(-1)).toHaveLength(8_192)
    })
  },
  '19-highest-priority-items': ({ topKFrequent }) => {
    it('[correctness] selects the k uniquely highest frequencies', () => {
      const result = topKFrequent([-1, -1, -1, 2, 2, 3, 4, 4, 4, 4], 2)
      expect([...result].sort((a, b) => a - b)).toEqual([-1, 4])
    })
    it('[edge-case] can retain every distinct value', () => {
      expect(topKFrequent([1, 2, 3], 3).sort((a: number, b: number) => a - b)).toEqual([1, 2, 3])
    })
    it('[contract] preserves input', () => {
      const values = [2, 2, 1]
      topKFrequent(values, 1)
      expect(values).toEqual([2, 2, 1])
    })
    it('[complexity] retains a small top-k from many distinct values', () => {
      const values: number[] = []
      for (let value = 1; value <= 500; value += 1) {
        for (let count = 0; count < value; count += 1) values.push(value)
      }
      expect(topKFrequent(values, 5).sort((a: number, b: number) => a - b)).toEqual([
        496, 497, 498, 499, 500,
      ])
    })
  },
  '20-consolidate-schedule-windows': ({ mergeWindows }) => {
    it('[correctness] merges nested, overlapping, and disjoint intervals', () => {
      expect(
        mergeWindows([
          [8, 10],
          [1, 9],
          [2, 3],
          [20, 21],
        ]),
      ).toEqual([
        [1, 10],
        [20, 21],
      ])
      expect(mergeWindows([])).toEqual([])
    })
    it('[edge-case] handles negative and touching endpoints', () => {
      expect(
        mergeWindows([
          [-4, -1],
          [-1, 2],
        ]),
      ).toEqual([[-4, 2]])
    })
    it('[contract] does not mutate outer or nested input arrays', () => {
      const windows = [
        [5, 7],
        [1, 2],
      ] as Array<[number, number]>
      const before = windows.map((window) => [...window])
      mergeWindows(windows)
      expect(windows).toEqual(before)
    })
  },
  '21-checkpoint-concurrent-rooms': ({ minimumConcurrentRooms }) => {
    it('[correctness] tracks peak concurrent half-open meetings', () => {
      expect(
        minimumConcurrentRooms([
          [1, 5],
          [2, 3],
          [3, 6],
          [7, 8],
        ]),
      ).toBe(2)
      expect(
        minimumConcurrentRooms([
          [1, 10],
          [2, 9],
          [3, 8],
        ]),
      ).toBe(3)
    })
    it('[edge-case] handles empty and fully reusable schedules', () => {
      expect(minimumConcurrentRooms([])).toBe(0)
      expect(
        minimumConcurrentRooms([
          [0, 1],
          [1, 2],
          [2, 3],
        ]),
      ).toBe(1)
    })
    it('[contract] preserves input', () => {
      const meetings = [
        [5, 6],
        [1, 3],
      ] as Array<[number, number]>
      minimumConcurrentRooms(meetings)
      expect(meetings).toEqual([
        [5, 6],
        [1, 3],
      ])
    })
    it('[complexity] handles a large set of simultaneously active meetings', () => {
      const meetings = Array.from(
        { length: 20_000 },
        (_, index) => [index, 100_000 + index] as [number, number],
      )
      expect(minimumConcurrentRooms(meetings)).toBe(20_000)
    })
  },
  '22-disconnected-service-groups': ({ countServiceGroups }) => {
    it('[correctness] counts components with isolated services', () => {
      expect(
        countServiceGroups(7, [
          [0, 1],
          [1, 2],
          [3, 4],
        ]),
      ).toBe(4)
      expect(countServiceGroups(0, [])).toBe(0)
    })
    it('[edge-case] tolerates duplicate and self connections', () => {
      expect(
        countServiceGroups(3, [
          [0, 1],
          [1, 0],
          [2, 2],
        ]),
      ).toBe(2)
    })
    it('[complexity] handles a long connected chain', () => {
      const connections: Array<[number, number]> = []
      for (let index = 1; index < 20_000; index += 1) connections.push([index - 1, index])
      expect(countServiceGroups(20_000, connections)).toBe(1)
    })
  },
  '23-non-adjacent-value': ({ maxNonAdjacentValue }) => {
    it('[correctness] chooses globally optimal non-adjacent values', () => {
      expect(maxNonAdjacentValue([5, 1, 1, 5])).toBe(10)
      expect(maxNonAdjacentValue([4, 10, 3, 1, 5])).toBe(15)
    })
    it('[edge-case] handles empty, negative, and singleton input', () => {
      expect(maxNonAdjacentValue([])).toBe(0)
      expect(maxNonAdjacentValue([-1, -2])).toBe(0)
      expect(maxNonAdjacentValue([7])).toBe(7)
    })
    it('[complexity] handles a long input', () => {
      expect(maxNonAdjacentValue(Array.from({ length: 100_000 }, () => 1))).toBe(50_000)
    })
  },
  '24-final-interview-simulation': ({ smallestCoveringRange, shortestRoute }) => {
    it('[correctness] finds a minimum range with required multiplicity', () => {
      expect(smallestCoveringRange(['a', 'x', 'a', 'b', 'a'], ['a', 'a', 'b'])).toEqual([2, 4])
      expect(smallestCoveringRange(['a', 'b', 'a', 'b'], ['a', 'b'])).toEqual([0, 1])
      expect(smallestCoveringRange(['a', 'b'], ['z'])).toBeNull()
      expect(smallestCoveringRange(['a'], [])).toBeNull()
    })
    it('[correctness] returns shortest unweighted route or impossibility', () => {
      expect(
        shortestRoute(
          6,
          [
            [0, 1],
            [1, 2],
            [0, 3],
            [3, 4],
            [4, 2],
          ],
          0,
          2,
        ),
      ).toBe(2)
      expect(shortestRoute(4, [[0, 1]], 0, 3)).toBe(-1)
      expect(shortestRoute(2, [], 1, 1)).toBe(0)
      expect(
        shortestRoute(
          5,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [0, 4],
          ],
          0,
          4,
        ),
      ).toBe(1)
    })
    it('[contract] preserves both parts inputs', () => {
      const events = ['a', 'b']
      const required = ['b']
      const edges = [[0, 1]] as Array<[number, number]>
      smallestCoveringRange(events, required)
      shortestRoute(2, edges, 0, 1)
      expect(events).toEqual(['a', 'b'])
      expect(required).toEqual(['b'])
      expect(edges).toEqual([[0, 1]])
    })
    it('[complexity] scales both final parts to interview-sized structures', () => {
      let reads = 0
      const events = guardedArray(
        [...Array.from({ length: 19_999 }, () => 'noise'), 'target'],
        () => reads++,
        200_000,
      )
      expect(smallestCoveringRange(events, ['target'])).toEqual([19_999, 19_999])
      expect(reads).toBeLessThan(200_000)

      const edges: Array<[number, number]> = []
      for (let service = 1; service < 20_000; service += 1) {
        edges.push([service - 1, service])
      }
      expect(shortestRoute(20_000, edges, 0, 19_999)).toBe(19_999)
    })
  },
}

function countedArray<T>(values: T[], onRead: () => void): T[] {
  return new Proxy(values, {
    get(target, property, receiver) {
      if (typeof property === 'string' && /^\d+$/.test(property)) onRead()
      return Reflect.get(target, property, receiver)
    },
  })
}

function guardedArray<T>(values: T[], onRead: () => void, maximumReads: number): T[] {
  let reads = 0
  return countedArray(values, () => {
    reads += 1
    onRead()
    if (reads >= maximumReads) {
      throw new Error(
        `Indexed-read budget exceeded (${maximumReads}); expected a scalable approach.`,
      )
    }
  })
}

function expectValidPair(result: [number, number] | null, values: number[], target: number): void {
  expect(result).not.toBeNull()
  const [left, right] = result!
  expect(left).not.toBe(right)
  expect(left).toBeGreaterThanOrEqual(0)
  expect(right).toBeGreaterThanOrEqual(0)
  expect(left).toBeLessThan(values.length)
  expect(right).toBeLessThan(values.length)
  expect(values[left]! + values[right]!).toBe(target)
}

function makeList(Node: any, values: number[]): any {
  return values.reduceRight((next, value) => new Node(value, next), null as any)
}

function listNodes(head: any): any[] {
  const nodes: any[] = []
  while (head) {
    nodes.push(head)
    head = head.next
  }
  return nodes
}

function listValues(head: any): number[] {
  return listNodes(head).map((node) => node.val as number)
}

function normalizeSubsets(subsets: number[][]): string[] {
  return subsets.map((subset) => [...subset].sort((a, b) => a - b).join(',')).sort()
}
