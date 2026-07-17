import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { analysisSections, type CheckFailure, type LessonManifest } from './models.js'

type RequiredSection = (typeof analysisSections)[number]

const legacySections: Record<RequiredSection, string[]> = {
  Contract: ['Clarifying questions', 'Examples and edge cases'],
  Approach: ['Baseline approach', 'Optimized approach'],
  'Correctness and complexity': ['Cost analysis', 'Invariant and correctness', 'Final complexity'],
}

export async function validateAnalysis(lesson: LessonManifest): Promise<CheckFailure[]> {
  return validateAnalysisText(lesson, await readAnalysis(lesson))
}

export function validateAnalysisText(
  lesson: Pick<LessonManifest, 'id'>,
  markdown: string,
): CheckFailure[] {
  const compactFormat = analysisSections.some((heading) => sectionBody(markdown, heading) !== null)
  const failures: CheckFailure[] = []

  for (const heading of analysisSections) {
    const visible = compactFormat
      ? visibleSection(markdown, heading)
      : combinedLegacySections(markdown, legacySections[heading])

    if (visible.length < 24 || wordCount(visible) < 4 || /\bTODO\b/i.test(visible)) {
      failures.push(
        sectionFailure(
          heading,
          `Add a concise ${heading.toLowerCase()} note (at least 4 words and 24 visible characters).`,
        ),
      )
      continue
    }

    if (heading === 'Correctness and complexity') {
      if (!/\bO\s*\([^)]+\)/i.test(visible)) {
        failures.push(
          sectionFailure(heading, 'Include explicit Big-O time and auxiliary-space bounds.'),
        )
        continue
      }
      if (
        !/\b(because|therefore|invariant|ensures|guarantees|must|cannot|proves?)\b/i.test(visible)
      ) {
        failures.push(
          sectionFailure(
            heading,
            'Give one direct reason the result is correct, using wording such as "because" or "therefore".',
          ),
        )
        continue
      }
      if (!/\b(time|runtime)\b/i.test(visible) || !/\b(space|auxiliary)\b/i.test(visible)) {
        failures.push(sectionFailure(heading, 'Label both the time and auxiliary-space costs.'))
        continue
      }
    }

    if (
      lesson.id === '24-final-interview-simulation' &&
      heading !== 'Contract' &&
      (!/\bPart\s*A\b/i.test(visible) || !/\bPart\s*B\b/i.test(visible))
    ) {
      failures.push(sectionFailure(heading, 'Address both Part A and Part B in this note.'))
    }
  }

  return failures
}

function combinedLegacySections(markdown: string, headings: string[]): string {
  return headings
    .map((heading) => visibleSection(markdown, heading))
    .filter(Boolean)
    .join('\n')
}

function visibleSection(markdown: string, heading: string): string {
  return (sectionBody(markdown, heading) ?? '').replace(/<!--[\s\S]*?-->/g, '').trim()
}

function wordCount(value: string): number {
  return (value.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g) ?? []).length
}

function sectionBody(markdown: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const documentWithSentinel = `${markdown.trimEnd()}\n\n## __END__\n`
  const expression = new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## )`, 'm')
  return expression.exec(documentWithSentinel)?.[1]?.trim() ?? null
}

function sectionFailure(heading: RequiredSection, evidence: string): CheckFailure {
  return {
    category: 'analysis',
    summary: `Complete the concise "${heading}" note before advancing.`,
    evidence,
  }
}

async function readAnalysis(lesson: LessonManifest): Promise<string> {
  return readFile(path.join(lesson.directory, 'analysis.md'), 'utf8')
}
