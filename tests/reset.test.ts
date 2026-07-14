import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resetState } from '../src/core/state.js'

describe('reset safety', () => {
  it('removes generated state without touching learner files', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'workshop-reset-'))
    const learner = path.join(root, 'lessons', 'example', 'solution.ts')
    await mkdir(path.dirname(learner), { recursive: true })
    await mkdir(path.join(root, '.workshop'), { recursive: true })
    await writeFile(learner, 'learner work\n', 'utf8')
    await writeFile(path.join(root, '.workshop', 'progress.json'), '{}\n', 'utf8')

    await resetState(root)

    expect(await readFile(learner, 'utf8')).toBe('learner work\n')
    await expect(
      readFile(path.join(root, '.workshop', 'progress.json'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })
})
