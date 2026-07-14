import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { analysisSections, type CheckFailure, type LessonManifest } from './models.js'

function sectionBody(markdown: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const documentWithSentinel = `${markdown.trimEnd()}\n\n## __END__\n`
  const expression = new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## )`, 'm')
  return expression.exec(documentWithSentinel)?.[1]?.trim() ?? null
}

export async function validateAnalysis(lesson: LessonManifest): Promise<CheckFailure[]> {
  const target = path.join(lesson.directory, 'analysis.md')
  const markdown = await readFile(target, 'utf8')

  for (const heading of analysisSections) {
    const body = sectionBody(markdown, heading)
    if (body === null) {
      return [
        {
          category: 'analysis',
          summary: `Missing analysis section: ${heading}`,
          evidence: `Add a level-two heading named "${heading}" to analysis.md.`,
        },
      ]
    }
    const visible = body.replace(/<!--[\s\S]*?-->/g, '').trim()
    if (visible.length < 20 || /\bTODO\b/i.test(visible)) {
      return [
        {
          category: 'analysis',
          summary: `Complete the "${heading}" section before checking code.`,
          evidence:
            'Replace the TODO prompt with your own concrete reasoning (at least one substantive sentence).',
        },
      ]
    }
  }

  return []
}
