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
      '03-pair-sum-at-scale',
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
      'export function levelOrder(queue:unknown[]){ return queue.shift() }',
      /disallowed \.shift/,
    ],
    [
      '19-highest-priority-items',
      'export function topKFrequent(values:number[]){ return values.sort() }',
      /disallowed \.sort|must construct and use MinPriorityQueue/,
    ],
    [
      '23-non-adjacent-value',
      'export function maxNonAdjacentValue(values:number[]){ const table=[0]; return table[values.length] }',
      /allocates collection-shaped/,
    ],
  ])('rejects a representative forbidden strategy for %s', (id, source, expected) => {
    expect(
      validateSourceText(id, source)
        .map((failure) => failure.summary)
        .join('\n'),
    ).toMatch(expected)
  })
})
