import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadLessons } from '../src/core/lessons.js'
import type { FailureCategory } from '../src/core/models.js'
import { stateDirectory } from '../src/core/state.js'
import { checkTypeScript } from '../src/verification/typescript-adapter.js'

interface KnownWrongFixture {
  lessonId: string
  expectedCategory: FailureCategory
  source: string
}

const fixtures: KnownWrongFixture[] = [
  {
    lessonId: '01-linear-scan',
    expectedCategory: 'correctness',
    source: `export function findFirstIndex(values: number[], target: number): number {
  return values[0] === target ? 0 : -1
}`,
  },
  {
    lessonId: '02-pair-sum-baseline',
    expectedCategory: 'correctness',
    source: `export function pairSumBaseline(values: number[], target: number): [number, number] | null {
  for (let left = 0; left < Math.min(values.length, 1); left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      if (values[left]! + values[right]! === target) return [left, right]
    }
  }
  return null
}`,
  },
  {
    lessonId: '02-pair-sum-baseline',
    expectedCategory: 'complexity',
    source: `export function pairSumBaseline(values: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>()
  for (let index = 0; index < values.length; index += 1) {
    const earlier = seen.get(target - values[index]!)
    if (earlier !== undefined) return [earlier, index]
    seen.set(values[index]!, index)
  }
  return null
}`,
  },
  {
    lessonId: '03-pair-sum-at-scale',
    expectedCategory: 'complexity',
    source: `export function pairSumAtScale(values: number[], target: number): [number, number] | null {
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      if (values[left]! + values[right]! === target) return [left, right]
    }
  }
  return null
}`,
  },
  {
    lessonId: '04-inventory-reconciliation',
    expectedCategory: 'edge-case',
    source: `export function sameInventory(first: string[], second: string[]): boolean {
  const firstCounts = new Map<string, number>()
  const secondCounts = new Map<string, number>()
  for (const item of first) firstCounts.set(item, (firstCounts.get(item) ?? 0) + 1)
  for (const item of second) secondCounts.set(item, (secondCounts.get(item) ?? 0) + 1)
  for (const [item, count] of firstCounts) {
    if (secondCounts.get(item) !== count) return false
  }
  return true
}`,
  },
  {
    lessonId: '04-inventory-reconciliation',
    expectedCategory: 'complexity',
    source: `export function sameInventory(first: string[], second: string[]): boolean {
  return [...first].sort().join('|') === [...second].sort().join('|')
}`,
  },
  {
    lessonId: '05-compact-sorted-identifiers',
    expectedCategory: 'complexity',
    source: `export function compactSortedIds(values: number[]): number {
  const distinct = [...new Set(values)]
  distinct.forEach((value, index) => (values[index] = value))
  return distinct.length
}`,
  },
  {
    lessonId: '06-checkpoint-nearby-events',
    expectedCategory: 'correctness',
    source: `export function hasNearbyRepeat(events: string[], maxDistance: number): boolean {
  return events.some((event, index) => index > 0 && maxDistance > 0 && events[index - 1] === event)
}`,
  },
  {
    lessonId: '07-best-reporting-period',
    expectedCategory: 'complexity',
    source: `export function maxWindowSum(values: number[], width: number): number | null {
  if (width <= 0 || width > values.length) return null
  let best = Number.NEGATIVE_INFINITY
  for (let left = 0; left + width <= values.length; left += 1) {
    let total = 0
    for (let index = left; index < left + width; index += 1) total += values[index]!
    best = Math.max(best, total)
  }
  return best
}`,
  },
  {
    lessonId: '08-longest-unique-event-run',
    expectedCategory: 'correctness',
    source: `export function longestUniqueRun(events: string[]): number {
  const seen = new Set<string>()
  for (const event of events) {
    if (seen.has(event)) return seen.size
    seen.add(event)
  }
  return seen.size
}`,
  },
  {
    lessonId: '09-balanced-delimiters',
    expectedCategory: 'correctness',
    source: `export function hasBalancedDelimiters(input: string): boolean {
  return ['()', '[]', '{}'].every(([open, close]) =>
    [...input].filter((value) => value === open).length ===
    [...input].filter((value) => value === close).length)
}`,
  },
  {
    lessonId: '10-merge-sorted-streams',
    expectedCategory: 'contract',
    source: `export class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}
export function mergeSortedStreams(first: ListNode | null, second: ListNode | null): ListNode | null {
  const values: number[] = []
  while (first) { values.push(first.val); first = first.next }
  while (second) { values.push(second.val); second = second.next }
  values.sort((left, right) => left - right)
  return values.reduceRight<ListNode | null>((next, value) => new ListNode(value, next), null)
}`,
  },
  {
    lessonId: '11-checkpoint-stable-segment',
    expectedCategory: 'correctness',
    source: `export function longestStableSegment(events: string[], allowedKinds: number): number {
  if (allowedKinds <= 0) return 0
  return new Set(events).size <= allowedKinds ? events.length : allowedKinds
}`,
  },
  {
    lessonId: '12-cyclic-dependency-chain',
    expectedCategory: 'complexity',
    source: `export class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}
export function hasCycle(head: ListNode | null): boolean {
  const seen = new Set<ListNode>()
  for (let node = head; node; node = node.next) {
    if (seen.has(node)) return true
    seen.add(node)
  }
  return false
}`,
  },
  {
    lessonId: '13-exact-sorted-lookup',
    expectedCategory: 'complexity',
    source: `export function binarySearch(values: number[], target: number): number {
  return values.indexOf(target)
}`,
  },
  {
    lessonId: '14-first-eligible-record',
    expectedCategory: 'complexity',
    source: `export function firstAtLeast(values: number[], threshold: number): number {
  return values.findIndex((value) => value >= threshold)
}`,
  },
  {
    lessonId: '15-generate-flag-selections',
    expectedCategory: 'correctness',
    source: `export function generateSubsets(values: number[]): number[][] {
  return [[], [...values]]
}`,
  },
  {
    lessonId: '16-checkpoint-processing-rate',
    expectedCategory: 'complexity',
    source: `export function minimumProcessingRate(jobs: number[], hours: number): number {
  for (let rate = 1; ; rate += 1) {
    let used = 0
    for (const job of jobs) used += Math.ceil(job / rate)
    if (used <= hours) return rate
  }
}`,
  },
  {
    lessonId: '17-hierarchy-depth',
    expectedCategory: 'correctness',
    source: `export class TreeNode {
  constructor(public val: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {}
}
export function maxDepth(root: TreeNode | null): number {
  return root ? 1 + maxDepth(root.left) : 0
}`,
  },
  {
    lessonId: '18-hierarchy-by-level',
    expectedCategory: 'complexity',
    source: `export class TreeNode {
  constructor(public val: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {}
}
export function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return []
  const queue = [root]
  const result: number[][] = []
  while (queue.length) {
    const node = queue.shift()!
    result.push([node.val])
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }
  return result
}`,
  },
  {
    lessonId: '19-highest-priority-items',
    expectedCategory: 'complexity',
    source: `export function topKFrequent(values: number[], k: number): number[] {
  const counts = new Map<number, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts].sort((left, right) => right[1] - left[1]).slice(0, k).map(([value]) => value)
}`,
  },
  {
    lessonId: '19-highest-priority-items',
    expectedCategory: 'complexity',
    source: `import { MinPriorityQueue } from './support.js'
export function topKFrequent(values: number[], k: number): number[] {
  const counts = new Map<number, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  const queue = new MinPriorityQueue<number>()
  for (const [value, frequency] of counts) queue.enqueue(value, frequency)
  while (queue.size > k) queue.dequeue()
  const result: number[] = []
  while (queue.size > 0) result.push(queue.dequeue()!)
  return result
}`,
  },
  {
    lessonId: '20-consolidate-schedule-windows',
    expectedCategory: 'correctness',
    source: `export type Window = [number, number]
export function mergeWindows(windows: Window[]): Window[] {
  const result = windows.map(([start, end]): Window => [start, end])
  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]!
    const current = result[index]!
    if (current[0] <= previous[1]) previous[1] = Math.max(previous[1], current[1])
  }
  return result
}`,
  },
  {
    lessonId: '21-checkpoint-concurrent-rooms',
    expectedCategory: 'edge-case',
    source: `export type Meeting = [number, number]
export function minimumConcurrentRooms(meetings: Meeting[]): number {
  return meetings.length
}`,
  },
  {
    lessonId: '22-disconnected-service-groups',
    expectedCategory: 'edge-case',
    source: `export type Connection = [number, number]
export function countServiceGroups(serviceCount: number, connections: Connection[]): number {
  return serviceCount - connections.length
}`,
  },
  {
    lessonId: '23-non-adjacent-value',
    expectedCategory: 'complexity',
    source: `export function maxNonAdjacentValue(values: number[]): number {
  const table = [0, Math.max(0, values[0] ?? 0)]
  for (let index = 2; index <= values.length; index += 1) {
    table[index] = Math.max(table[index - 1]!, table[index - 2]! + values[index - 1]!)
  }
  return table[values.length] ?? 0
}`,
  },
  {
    lessonId: '24-final-interview-simulation',
    expectedCategory: 'complexity',
    source: `export type Edge = [number, number]
export function smallestCoveringRange(events: string[], required: string[]): [number, number] | null {
  if (required.length === 0) return null
  const need = new Map<string, number>()
  for (const value of required) need.set(value, (need.get(value) ?? 0) + 1)
  let best: [number, number] | null = null
  for (let left = 0; left < events.length; left += 1) {
    const seen = new Map<string, number>()
    for (let right = left; right < events.length; right += 1) {
      const value = events[right]!
      seen.set(value, (seen.get(value) ?? 0) + 1)
      if ([...need].every(([key, count]) => (seen.get(key) ?? 0) >= count)) {
        if (!best || right - left < best[1] - best[0]) best = [left, right]
        break
      }
    }
  }
  return best
}
export function shortestRoute(count: number, edges: Edge[], start: number, end: number): number {
  if (start === end) return 0
  const graph = Array.from({ length: count }, () => [] as number[])
  for (const [left, right] of edges) { graph[left]!.push(right); graph[right]!.push(left) }
  const queue: Array<[number, number]> = [[start, 0]]
  const seen = new Set([start])
  let read = 0
  while (read < queue.length) {
    const [node, distance] = queue[read++]!
    for (const next of graph[node]!) {
      if (seen.has(next)) continue
      if (next === end) return distance + 1
      seen.add(next)
      queue.push([next, distance + 1])
    }
  }
  return -1
}`,
  },
  {
    lessonId: '24-final-interview-simulation',
    expectedCategory: 'correctness',
    source: `export type Edge = [number, number]
export function smallestCoveringRange(events: string[], required: string[]): [number, number] | null {
  if (required.length === 0) return null
  const needed = new Map<string, number>()
  for (const event of required) needed.set(event, (needed.get(event) ?? 0) + 1)
  const present = new Map<string, number>()
  let matched = 0
  let left = 0
  let best: [number, number] | null = null
  for (let right = 0; right < events.length; right += 1) {
    const incoming = events[right]!
    if (needed.has(incoming)) {
      const count = (present.get(incoming) ?? 0) + 1
      present.set(incoming, count)
      if (count <= needed.get(incoming)!) matched += 1
    }
    while (matched === required.length) {
      if (!best || right - left < best[1] - best[0]) best = [left, right]
      const outgoing = events[left++]!
      if (needed.has(outgoing)) {
        const count = present.get(outgoing)! - 1
        present.set(outgoing, count)
        if (count < needed.get(outgoing)!) matched -= 1
      }
    }
  }
  return best
}
export function shortestRoute(count: number, edges: Edge[], start: number, end: number): number {
  const graph = Array.from({ length: count }, () => [] as number[])
  for (const [left, right] of edges) { graph[left]!.push(right); graph[right]!.push(left) }
  function visit(node: number, seen: Set<number>): number {
    if (node === end) return 0
    seen.add(node)
    for (const next of graph[node]!) {
      if (seen.has(next)) continue
      const distance = visit(next, seen)
      if (distance >= 0) return distance + 1
    }
    return -1
  }
  return visit(start, new Set())
}`,
  },
]

describe('known-wrong verifier regressions', () => {
  const cases = fixtures.map((fixture, index) => ({ ...fixture, fixtureNumber: index + 1 }))

  it.each(cases)(
    'rejects $lessonId fixture $fixtureNumber through the real adapter',
    async (fixture) => {
      const root = process.cwd()
      const generated = path.join(
        stateDirectory(root),
        'generated',
        `known-wrong-${process.pid}-${fixture.fixtureNumber}-${Date.now()}`,
      )
      const lessons = new Map((await loadLessons(root)).map((lesson) => [lesson.id, lesson]))

      try {
        const directory = path.join(generated, fixture.lessonId)
        const solutionPath = path.join(directory, 'solution.ts')
        const publicTestPath = path.join(directory, 'public.test.ts')
        const lesson = lessons.get(fixture.lessonId)!
        await mkdir(directory, { recursive: true })
        await writeFile(solutionPath, `${fixture.source}\n`, 'utf8')
        if (fixture.lessonId === '19-highest-priority-items') {
          await writeFile(
            path.join(directory, 'support.ts'),
            await readFile(
              path.join(lesson.directory, 'solutions', 'typescript', 'support.ts'),
              'utf8',
            ),
            'utf8',
          )
        }
        await writeFile(
          publicTestPath,
          `import { describe, expect, it } from 'vitest'\n` +
            `describe('fixture import', () => { it('loads', () => expect(true).toBe(true)) })\n`,
          'utf8',
        )
        const result = await checkTypeScript(root, lesson, {
          solutionPath,
          publicTestPath,
          skipTypecheck: true,
          verificationOutputDirectory: path.join(directory, 'results'),
        })
        expect(result.passed, fixture.lessonId).toBe(false)
        expect(
          result.failures.map((failure) => failure.category),
          fixture.lessonId,
        ).toContain(fixture.expectedCategory)
      } finally {
        await rm(generated, { recursive: true, force: true })
      }
    },
    30_000,
  )
})
