import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { validateSourceText } from '../src/verification/source-policies.js'

const BundleSchema = z.object({
  version: z.literal(1),
  lessons: z.record(
    z.string(),
    z.object({ encoding: z.literal('base64'), sha256: z.string(), content: z.string() }),
  ),
})

describe('lesson-specific source policies', () => {
  it('accepts every packaged reference governed by a source policy', async () => {
    const bundle = BundleSchema.parse(
      JSON.parse(
        await readFile(path.join(process.cwd(), 'assets', 'reference-solutions.json'), 'utf8'),
      ) as unknown,
    )
    const governed = [
      '02-pair-sum-baseline',
      '03-pair-sum-at-scale',
      '04-inventory-reconciliation',
      '05-compact-sorted-identifiers',
      '12-cyclic-dependency-chain',
      '18-hierarchy-by-level',
      '19-highest-priority-items',
      '23-non-adjacent-value',
    ]
    for (const id of governed) {
      const entry = bundle.lessons[id]!
      const source = Buffer.from(entry.content, 'base64').toString('utf8')
      expect(validateSourceText(id, source), id).toEqual([])
    }
  })

  it.each([
    [
      '02-pair-sum-baseline',
      'export function pairSumBaseline(values:number[]){ return new Map(values.map((value, index) => [value, index])) }',
      /exhaustive nested-loop baseline/,
    ],
    [
      '03-pair-sum-at-scale',
      'export function pairSumAtScale(values:number[]){ return values[0] ?? null }',
      /must construct and use Map/,
    ],
    [
      '05-compact-sorted-identifiers',
      'export function compactSortedIds(values:number[]){ const copy=[...new Set(values)]; return copy.length }',
      /allocates collection-shaped/,
    ],
    [
      '12-cyclic-dependency-chain',
      'export function hasCycle(head:unknown){ const seen=new Set(); return seen.has(head) }',
      /allocates collection-shaped/,
    ],
    [
      '18-hierarchy-by-level',
      'export function levelOrder(){ const queue: unknown[] = []; return queue.shift() }',
      /disallowed \.shift/,
    ],
    [
      '19-highest-priority-items',
      'export function topKFrequent(values:number[]){ return values.sort() }',
      /disallowed \.sort|must construct and use MinPriorityQueue/,
    ],
    [
      '23-non-adjacent-value',
      'export function maxNonAdjacentValue(values:number[]){ const table=[0]; table[values.length]=1; return table[values.length] }',
      /allocates collection-shaped/,
    ],
  ])('rejects a representative forbidden strategy for %s', (id, source, expected) => {
    expect(
      validateSourceText(id, source)
        .map((failure) => failure.summary)
        .join('\n'),
    ).toMatch(expected)
  })

  it('checks prohibited work delegated to reachable helpers', () => {
    expect(
      validateSourceText(
        '23-non-adjacent-value',
        `function build(values: number[]) {
  const table = [0]
  for (let index = 0; index < values.length; index += 1) table[index] = index
  return table.at(-1) ?? 0
}
export function maxNonAdjacentValue(values: number[]) { return build(values) }`,
      ).map(({ summary }) => summary),
    ).toContain('maxNonAdjacentValue allocates collection-shaped auxiliary state.')

    expect(
      validateSourceText(
        '19-highest-priority-items',
        `import { MinPriorityQueue } from './support.js'
function order(values: number[]) { return values.sort() }
export function topKFrequent(values: number[]) {
  const queue = new MinPriorityQueue<number>()
  queue.enqueue(1, 1)
  return order(values)
}`,
      )
        .map(({ summary }) => summary)
        .join('\n'),
    ).toMatch(/disallowed \.sort/)
  })

  it('rejects unused required constructors', () => {
    expect(
      validateSourceText(
        '03-pair-sum-at-scale',
        `export function pairSumAtScale(values: number[]) {
  const unused = new Map<number, number>()
  return values.length ? [0, 0] : null
}`,
      )
        .map(({ summary }) => summary)
        .join('\n'),
    ).toMatch(/must construct and use Map/)
  })

  it('accepts fixed-size O(1) tuple and object state', () => {
    expect(
      validateSourceText(
        '23-non-adjacent-value',
        `export function maxNonAdjacentValue(values: number[]) {
  const state = [0, 0]
  const metadata = { current: 0 }
  return values.length + state[0] + metadata.current
}`,
      ),
    ).toEqual([])
  })

  it('allows shift on a custom deque while rejecting Array shift', () => {
    expect(
      validateSourceText(
        '18-hierarchy-by-level',
        `declare const deque: { shift(): unknown }
export function levelOrder() { deque.shift(); return [] }`,
      ),
    ).toEqual([])
    expect(
      validateSourceText(
        '18-hierarchy-by-level',
        `export function levelOrder() { const queue: unknown[] = []; queue.shift(); return [] }`,
      )
        .map(({ summary }) => summary)
        .join('\n'),
    ).toMatch(/disallowed \.shift/)
  })
})
