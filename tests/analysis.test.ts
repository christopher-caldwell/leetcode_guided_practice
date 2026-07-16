import { describe, expect, it } from 'vitest'
import { validateAnalysisText, validatePostPassReflectionText } from '../src/core/analysis.js'

const completeAnalysis = `# Analysis

## Clarifying questions

What should empty input return? I will assume the input contract permits an empty collection.

## Examples and edge cases

I will trace a representative input, empty input, and a boundary containing repeated values.

## Baseline approach

The baseline checks every candidate directly, which is correct but repeats the same expensive work.

## Cost analysis

With n input values, the baseline takes O(n^2) time and O(1) auxiliary space.

## Optimized approach

The optimized approach retains the information needed to avoid repeating earlier comparisons entirely.

## Invariant and correctness

The invariant ensures every earlier candidate has been handled correctly before the boundary advances.

## Final complexity

Each value is processed a bounded number of times, giving O(n) time and O(1) auxiliary space.

## Post-pass reflection

The recognition signal is repeated work between adjacent candidates; next time I will name that cost earlier.
`

describe('analysis evidence', () => {
  it('requires concrete section-specific evidence without pretending to semantically grade it', () => {
    expect(validateAnalysisText({ id: '01-example' }, completeAnalysis)).toEqual([])
    expect(validatePostPassReflectionText(completeAnalysis)).toEqual([])
    expect(
      validateAnalysisText(
        { id: '01-example' },
        completeAnalysis
          .replace('O(n^2) time', 'quadratic time')
          .replace('O(1) auxiliary', 'constant auxiliary'),
      )[0]?.evidence,
    ).toMatch(/Big-O/)
  })

  it('requires separate evidence for both final-simulation algorithms', () => {
    expect(
      validateAnalysisText({ id: '24-final-interview-simulation' }, completeAnalysis)[0],
    ).toMatchObject({
      category: 'analysis',
    })
    const finalAnalysis = completeAnalysis.replaceAll(
      /^(The baseline|With n|The optimized|The invariant|Each value)/gm,
      'Part A and Part B: $1',
    )
    expect(validateAnalysisText({ id: '24-final-interview-simulation' }, finalAnalysis)).toEqual([])
  })

  it('keeps post-pass reflection as a separate progression gate', () => {
    const withoutReflection = completeAnalysis.replace(
      'The recognition signal is repeated work between adjacent candidates; next time I will name that cost earlier.',
      '<!-- Complete this after passing. -->',
    )
    expect(validateAnalysisText({ id: '01-example' }, withoutReflection)).toEqual([])
    expect(validatePostPassReflectionText(withoutReflection)[0]?.summary).toContain(
      'Post-pass reflection',
    )
  })
})
