import { describe, expect, it } from 'vitest'
import {
  allPracticeProblems,
  loadConceptGuides,
  loadCoreLessonMap,
  loadPracticeCatalog,
  loadPracticeContracts,
} from '../src/practice/catalog.js'
import { loadLessons } from '../src/core/lessons.js'

const root = process.cwd()

describe('supplemental practice catalog', () => {
  it('contains the foundation, core-extension, and focused interview groups', async () => {
    const catalog = await loadPracticeCatalog(root)
    expect(catalog.groups.map((group) => group.id)).toEqual([
      'set-membership',
      'frequency-maps',
      'complement-lookup',
      'canonical-representation',
      'prefix-state',
      'difference-and-sweeps',
      'index-placement',
      'two-pointers-windows',
      'stacks-monotonic',
      'linked-list-pointers',
      'binary-search-variants',
      'recursion-backtracking',
      'tree-traversal',
      'heaps-streaming',
      'graph-search',
      'dynamic-programming-greedy',
      'focused-interview-arrays',
    ])
    expect(catalog.groups.every((group) => group.problems.length >= 3)).toBe(true)
    expect(allPracticeProblems(catalog)).toHaveLength(104)
    expect(
      catalog.groups
        .find((group) => group.id === 'focused-interview-arrays')
        ?.problems.map((problem) => problem.id),
    ).toEqual([
      'focus-01',
      'focus-02',
      'focus-03',
      'focus-04',
      'focus-05',
      'focus-06',
      'focus-07',
      'focus-08',
    ])
  })

  it('keeps ids, source proposals, and titles unique', async () => {
    const problems = allPracticeProblems(await loadPracticeCatalog(root))
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(problems.length)
    expect(new Set(problems.map((problem) => problem.origin)).size).toBe(problems.length)
    expect(new Set(problems.map((problem) => problem.title)).size).toBe(problems.length)
  })

  it('validates every explicitly declared catalog variant', async () => {
    const problems = allPracticeProblems(await loadPracticeCatalog(root))
    for (const problem of problems) {
      expect(problem.related_lessons.every((related) => related.relationship === 'variant')).toBe(
        true,
      )
      expect(problem.related_lessons.every((related) => related.distinction.length >= 20)).toBe(
        true,
      )
    }
  })

  it('omits submitted forms that would exactly duplicate a core or selected exercise', async () => {
    const origins = new Set(
      allPracticeProblems(await loadPracticeCatalog(root)).map((problem) => problem.origin),
    )
    expect(origins.has('A2')).toBe(false)
    expect(origins.has('C1')).toBe(false)
    expect(origins.has('E9')).toBe(false)
  })

  it('maps every practice problem to valid core curriculum lessons', async () => {
    const [catalog, coreLessonMap, lessons] = await Promise.all([
      loadPracticeCatalog(root),
      loadCoreLessonMap(root),
      loadLessons(root),
    ])
    const problems = allPracticeProblems(catalog)
    expect(Object.keys(coreLessonMap).sort()).toEqual(problems.map((problem) => problem.id).sort())
    const lessonIds = new Set(lessons.map((lesson) => lesson.id))
    for (const links of Object.values(coreLessonMap)) {
      expect(links.every((link) => lessonIds.has(link.lesson_id))).toBe(true)
    }
    expect(
      new Set(Object.values(coreLessonMap).flatMap((links) => links.map((link) => link.lesson_id))),
    ).toEqual(lessonIds)
  })

  it('provides one learn-first guide per group and one TypeScript contract per problem', async () => {
    const [catalog, guides, contracts] = await Promise.all([
      loadPracticeCatalog(root),
      loadConceptGuides(root),
      loadPracticeContracts(root),
    ])
    expect(Object.keys(guides).sort()).toEqual(catalog.groups.map((group) => group.id).sort())
    expect(Object.keys(contracts).sort()).toEqual(
      allPracticeProblems(catalog)
        .map((problem) => problem.id)
        .sort(),
    )
  })
})
