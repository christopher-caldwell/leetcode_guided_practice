import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  CoreLessonMapSchema,
  ConceptGuideMapSchema,
  PracticeContractMapSchema,
  type ConceptGuideMap,
  PracticeCatalogSchema,
  type CoreLessonMap,
  type PracticeCatalog,
  type PracticeContractMap,
  type PracticeGroup,
  type PracticeProblem,
} from './models.js'

export async function loadPracticeCatalog(root: string): Promise<PracticeCatalog> {
  const practiceRoot = path.join(root, 'practice')
  const shardRoot = path.join(practiceRoot, 'catalogs')
  const shardNames = (await readdir(shardRoot)).filter((name) => name.endsWith('.json')).sort()
  const catalogs = await Promise.all(
    [
      path.join(practiceRoot, 'catalog.json'),
      ...shardNames.map((name) => path.join(shardRoot, name)),
    ].map(async (target) =>
      PracticeCatalogSchema.parse(JSON.parse(await readFile(target, 'utf8')) as unknown),
    ),
  )
  return PracticeCatalogSchema.parse({
    version: 1,
    groups: catalogs.flatMap((catalog) => catalog.groups),
  })
}

export async function loadCoreLessonMap(root: string): Promise<CoreLessonMap> {
  const raw = JSON.parse(
    await readFile(path.join(root, 'practice', 'core-lessons.json'), 'utf8'),
  ) as unknown
  return CoreLessonMapSchema.parse(raw)
}

export async function loadConceptGuides(root: string): Promise<ConceptGuideMap> {
  const raw = JSON.parse(
    await readFile(path.join(root, 'practice', 'concepts.json'), 'utf8'),
  ) as unknown
  return ConceptGuideMapSchema.parse(raw)
}

export async function loadPracticeContracts(root: string): Promise<PracticeContractMap> {
  const raw = JSON.parse(
    await readFile(path.join(root, 'practice', 'contracts.json'), 'utf8'),
  ) as unknown
  return PracticeContractMapSchema.parse(raw)
}

export function allPracticeProblems(catalog: PracticeCatalog): PracticeProblem[] {
  return catalog.groups.flatMap((group) => group.problems)
}

export function findPracticeProblem(
  catalog: PracticeCatalog,
  id: string,
): PracticeProblem | undefined {
  return allPracticeProblems(catalog).find((problem) => problem.id === id)
}

export function findPracticeGroup(
  catalog: PracticeCatalog,
  problemId: string,
): PracticeGroup | undefined {
  return catalog.groups.find((group) => group.problems.some((problem) => problem.id === problemId))
}
