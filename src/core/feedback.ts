import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { stateDirectory } from './state.js'
import type {
  AnalysisAssessmentResponse,
  DiagnosisResponse,
  ReviewResponse,
} from '../providers/coach.js'

export async function saveAnalysisAssessment(
  root: string,
  lessonId: string,
  response: AnalysisAssessmentResponse,
): Promise<string> {
  const directory = path.join(stateDirectory(root), 'feedback', lessonId)
  await mkdir(directory, { recursive: true })
  const target = path.join(directory, `analysis-assessment-${Date.now()}.md`)
  const content = `# Analysis assessment

- Verdict: ${response.passed ? 'PASS' : 'FAIL'}

## Feedback

${response.feedback}
`
  await writeFile(target, content, 'utf8')
  return target
}

export async function saveDiagnosis(
  root: string,
  lessonId: string,
  attempt: number,
  response: DiagnosisResponse,
): Promise<string> {
  const directory = path.join(stateDirectory(root), 'feedback', lessonId)
  await mkdir(directory, { recursive: true })
  const target = path.join(directory, `attempt-${attempt}-diagnosis.md`)
  const content = `# Attempt ${attempt} coaching

- Category: ${response.category}
- What is working: ${response.whatIsWorking}
- Observation: ${response.observation}
- Next step: ${response.nextStep}
- Question: ${response.question}
`
  await writeFile(target, content, 'utf8')
  return target
}

export async function saveReview(
  root: string,
  lessonId: string,
  response: ReviewResponse,
): Promise<string> {
  const directory = path.join(stateDirectory(root), 'feedback', lessonId)
  await mkdir(directory, { recursive: true })
  const target = path.join(directory, `review-${Date.now()}.md`)
  const strengths = response.strengths.map((item) => `- ${item}`).join('\n') || '- None recorded.'
  const improvements =
    response.improvements.map((item) => `- ${item}`).join('\n') || '- None recorded.'
  const content = `# Coaching review

## Scores (1–4)

- Correctness: ${response.scores.correctness}
- Complexity: ${response.scores.complexity}
- Clarity: ${response.scores.clarity}
- Communication: ${response.scores.communication}

## Strengths

${strengths}

## Improvements

${improvements}

## Tradeoff to discuss

${response.tradeoff}

## Summary

${response.summary}
`
  await writeFile(target, content, 'utf8')
  return target
}
