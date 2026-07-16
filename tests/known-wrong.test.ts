import { mkdir, rm, writeFile } from 'node:fs/promises'
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
  for (let index = 1; index < values.length; index += 1) {
    if (values[0]! + values[index]! === target) return [0, index]
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
    lessonId: '05-compact-sorted-identifiers',
    expectedCategory: 'complexity',
    source: `export function compactSortedIds(values: number[]): number {
  const distinct = [...new Set(values)]
  distinct.forEach((value, index) => (values[index] = value))
  return distinct.length
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
    expectedCategory: 'correctness',
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
  it('rejects representative incomplete and wrong-complexity solutions through the real adapter', async () => {
    const root = process.cwd()
    const generated = path.join(
      stateDirectory(root),
      'generated',
      `known-wrong-${process.pid}-${Date.now()}`,
    )
    const lessons = new Map((await loadLessons(root)).map((lesson) => [lesson.id, lesson]))

    try {
      for (const fixture of fixtures) {
        const directory = path.join(generated, fixture.lessonId)
        const solutionPath = path.join(directory, 'solution.ts')
        const publicTestPath = path.join(directory, 'public.test.ts')
        await mkdir(directory, { recursive: true })
        await writeFile(solutionPath, `${fixture.source}\n`, 'utf8')
        await writeFile(
          publicTestPath,
          `import { describe, expect, it } from 'vitest'\n` +
            `describe('fixture import', () => { it('loads', () => expect(true).toBe(true)) })\n`,
          'utf8',
        )
        const result = await checkTypeScript(root, lessons.get(fixture.lessonId)!, {
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
      }
    } finally {
      await rm(generated, { recursive: true, force: true })
    }
  }, 30_000)
})
