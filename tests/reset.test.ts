import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { handleResetCommand } from '../src/core/reset-command.js'
import { resetState } from '../src/core/state.js'

describe('reset safety', () => {
  it('removes generated state without touching learner files', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'workshop-reset-'))
    const learner = path.join(root, 'lessons', 'example', 'learner_solution.ts')
    const freshAttempt = path.join(
      root,
      'practice',
      'attempts',
      'focus-04',
      'attempt-001',
      'learner_solution.ts',
    )
    await mkdir(path.dirname(learner), { recursive: true })
    await mkdir(path.dirname(freshAttempt), { recursive: true })
    await mkdir(path.join(root, '.workshop'), { recursive: true })
    await writeFile(learner, 'learner work\n', 'utf8')
    await writeFile(freshAttempt, 'fresh learner work\n', 'utf8')
    await writeFile(path.join(root, '.workshop', 'progress.json'), '{}\n', 'utf8')

    await resetState(root)

    expect(await readFile(learner, 'utf8')).toBe('learner work\n')
    expect(await readFile(freshAttempt, 'utf8')).toBe('fresh learner work\n')
    await expect(
      readFile(path.join(root, '.workshop', 'progress.json'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })

  it('lets the CLI reset before parsing malformed generated state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'workshop-reset-cli-'))
    const learner = path.join(root, 'lessons', 'example', 'learner_solution.ts')
    await mkdir(path.dirname(learner), { recursive: true })
    await mkdir(path.join(root, '.workshop'), { recursive: true })
    await writeFile(learner, 'learner work\n', 'utf8')
    await writeFile(path.join(root, '.workshop', 'progress.json'), '{malformed', 'utf8')

    const messages: string[] = []
    const handled = await handleResetCommand(root, 'reset', (message) => messages.push(message))

    expect(handled).toBe(true)
    expect(messages).toHaveLength(2)
    expect(await readFile(learner, 'utf8')).toBe('learner work\n')
    await expect(
      readFile(path.join(root, '.workshop', 'progress.json'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })
})
