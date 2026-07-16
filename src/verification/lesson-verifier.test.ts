import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { registerVerifier } from './verifiers.js'

const lessonId = process.env.WORKSHOP_LESSON_ID
if (!lessonId || !/^\d{2}-[a-z0-9-]+$/.test(lessonId)) {
  throw new Error('WORKSHOP_LESSON_ID must identify the lesson being checked')
}

const sourceOverride = process.env.WORKSHOP_SOLUTION_PATH
const source = sourceOverride
  ? path.resolve(sourceOverride)
  : path.join(process.cwd(), 'lessons', lessonId, 'solutions', 'typescript', 'solution.ts')
const subject = (await import(`${pathToFileURL(source).href}?check=${Date.now()}`)) as Record<
  string,
  unknown
>

registerVerifier(lessonId, subject)
