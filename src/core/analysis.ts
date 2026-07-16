import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { analysisSections, type CheckFailure, type LessonManifest } from './models.js'

const minimumWords = 8
const postPassReflection = 'Post-pass reflection'

export async function validateAnalysis(lesson: LessonManifest): Promise<CheckFailure[]> {
  return validateAnalysisText(lesson, await readAnalysis(lesson))
}

export async function validatePostPassReflection(lesson: LessonManifest): Promise<CheckFailure[]> {
  return validatePostPassReflectionText(await readAnalysis(lesson))
}

export function validateAnalysisText(
  lesson: Pick<LessonManifest, 'id'>,
  markdown: string,
): CheckFailure[] {
  for (const heading of analysisSections) {
    const visible = completedSection(markdown, heading)
    if (visible instanceof Error) return [sectionFailure(heading, visible.message)]

    if (heading === 'Clarifying questions' && !visible.includes('?')) {
      return [sectionFailure(heading, 'Include at least one actual question ending in "?".')]
    }
    if (
      (heading === 'Cost analysis' || heading === 'Final complexity') &&
      !/\bO\s*\([^)]+\)/i.test(visible)
    ) {
      return [sectionFailure(heading, 'State at least one explicit Big-O bound such as O(n).')]
    }
    if (
      heading === 'Invariant and correctness' &&
      !/\b(invariant|remains|always|ensures|guarantees)\b/i.test(visible)
    ) {
      return [
        sectionFailure(
          heading,
          'Name what remains true using a term such as invariant, remains, ensures, or guarantees.',
        ),
      ]
    }

    if (
      lesson.id === '24-final-interview-simulation' &&
      heading !== 'Clarifying questions' &&
      heading !== 'Examples and edge cases' &&
      (!/\bPart\s*A\b/i.test(visible) || !/\bPart\s*B\b/i.test(visible))
    ) {
      return [
        sectionFailure(
          heading,
          'The final contains two algorithms; label and address both Part A and Part B in this section.',
        ),
      ]
    }
  }

  return []
}

export function validatePostPassReflectionText(markdown: string): CheckFailure[] {
  const visible = completedSection(markdown, postPassReflection)
  if (visible instanceof Error) return [sectionFailure(postPassReflection, visible.message)]
  return []
}

function completedSection(markdown: string, heading: string): string | Error {
  const body = sectionBody(markdown, heading)
  if (body === null) return new Error(`Add a level-two heading named "${heading}".`)
  const visible = body.replace(/<!--[\s\S]*?-->/g, '').trim()
  const words = visible.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g) ?? []
  if (visible.length < 40 || words.length < minimumWords || /\bTODO\b/i.test(visible)) {
    return new Error(
      `Replace the prompt with your own concrete evidence (at least ${minimumWords} words and 40 visible characters).`,
    )
  }
  return visible
}

function sectionBody(markdown: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const documentWithSentinel = `${markdown.trimEnd()}\n\n## __END__\n`
  const expression = new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## )`, 'm')
  return expression.exec(documentWithSentinel)?.[1]?.trim() ?? null
}

function sectionFailure(heading: string, evidence: string): CheckFailure {
  return {
    category: 'analysis',
    summary: `Complete the "${heading}" section before advancing.`,
    evidence,
  }
}

async function readAnalysis(lesson: LessonManifest): Promise<string> {
  return readFile(path.join(lesson.directory, 'analysis.md'), 'utf8')
}
