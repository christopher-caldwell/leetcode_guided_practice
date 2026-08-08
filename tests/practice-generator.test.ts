import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  findPracticeProblem,
  loadPracticeCatalog,
  loadPracticeContracts,
} from '../src/practice/catalog.js'
import { CodexPracticeGenerator } from '../src/practice/generator.js'

const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  )
})

describe('Codex practice generation', () => {
  it('generates a schema-validated variant from an isolated read-only Codex process', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'practice-generator-'))
    temporaryRoots.push(root)
    const executable = path.join(root, 'fake-codex.mjs')
    await writeFile(
      executable,
      `#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
const output = args[args.indexOf('--output-last-message') + 1]
writeFileSync(output, JSON.stringify({
  title: process.cwd().endsWith('practice-generator-sandbox') ? 'Fresh Calibration Pair' : 'Wrong Working Directory',
  statement: process.env.WORKSHOP_TEST_SECRET
    ? 'A secret leaked into this generated statement, which should never happen in the isolated generator process.'
    : 'Two distinct calibration readings must combine to a requested total; return their positions or report that no pair exists.',
  constraints: ['The input can contain duplicate readings', 'Every value is a safe integer', 'Do not mutate the supplied readings'],
  examples: [
    { input: '([4, 6, 9], 10)', output: '[0, 1]', explanation: null },
    { input: '([1, 2], 8)', output: 'null', explanation: null }
  ]
}))
`,
      'utf8',
    )
    await chmod(executable, 0o755)
    const [catalog, contracts] = await Promise.all([
      loadPracticeCatalog(process.cwd()),
      loadPracticeContracts(process.cwd()),
    ])
    const problem = findPracticeProblem(catalog, 'focus-04')!
    const previous = process.env.WORKSHOP_TEST_SECRET
    process.env.WORKSHOP_TEST_SECRET = 'must-not-be-forwarded'
    try {
      const generated = await new CodexPracticeGenerator(root, executable).generate(
        problem,
        contracts[problem.id]!,
      )
      expect(generated).toMatchObject({
        title: 'Fresh Calibration Pair',
        examples: [{ output: '[0, 1]' }, { output: 'null' }],
      })
      expect(generated.statement).not.toContain('secret leaked')
    } finally {
      if (previous === undefined) delete process.env.WORKSHOP_TEST_SECRET
      else process.env.WORKSHOP_TEST_SECRET = previous
    }
  })

  it('reports an unavailable Codex executable without creating an attempt', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'practice-generator-unavailable-'))
    temporaryRoots.push(root)
    const [catalog, contracts] = await Promise.all([
      loadPracticeCatalog(process.cwd()),
      loadPracticeContracts(process.cwd()),
    ])
    const problem = findPracticeProblem(catalog, 'focus-04')!
    await expect(
      new CodexPracticeGenerator(root, 'definitely-not-a-real-codex').generate(
        problem,
        contracts[problem.id]!,
      ),
    ).rejects.toThrow(/ENOENT|not-a-real/)
  })
})
