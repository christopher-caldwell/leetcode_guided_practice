import path from 'node:path'
import { ensureLearnerFiles } from '../src/core/learner-files.js'
import { loadLessons } from '../src/core/lessons.js'

const root = process.cwd()
const result = await ensureLearnerFiles(await loadLessons(root))

console.log(
  `Learner workspace ready: created ${result.created.length}, preserved ${result.preserved.length}.`,
)
if (result.created.length > 0) {
  console.log(
    `Created files are ignored by Git. Start with ${path.relative(root, result.created[0]!)}`,
  )
}
