import { describe, expect, it } from 'vitest'
import { validateAnalysisText } from '../src/core/analysis.js'

const completeAnalysis = `# Analysis

## Contract

Empty input returns the documented absence value without special caller behavior.

## Approach

Scan candidates from left to right and stop when the first valid answer is established.

## Correctness and complexity

The result is first because every earlier candidate was rejected. Runtime is O(n) time and auxiliary usage is O(1) space.
`

describe('concise analysis notes', () => {
  it('accepts three short, interview-useful notes', () => {
    expect(validateAnalysisText({ id: '01-example' }, completeAnalysis)).toEqual([])
  })

  it('reports writing gaps separately and all at once', () => {
    const failures = validateAnalysisText(
      { id: '01-example' },
      '# Analysis\n\n## Contract\n\n<!-- TODO -->\n\n## Approach\n\n<!-- TODO -->\n',
    )
    expect(failures).toHaveLength(3)
    expect(failures.every((failure) => failure.category === 'analysis')).toBe(true)
  })

  it('requires a correctness reason plus labeled time and space bounds', () => {
    const failures = validateAnalysisText(
      { id: '01-example' },
      completeAnalysis.replace(
        'The result is first because every earlier candidate was rejected. Runtime is O(n) time and auxiliary usage is O(1) space.',
        'The scan uses O(n) operations.',
      ),
    )
    expect(failures[0]?.summary).toContain('Correctness and complexity')
  })

  it('accepts the former seven-section format without requiring a post-pass reflection', () => {
    const legacy = `# Analysis

## Clarifying questions
What happens for empty input? I use the documented sentinel.
## Examples and edge cases
I checked an empty input and a duplicate target.
## Baseline approach
Scan each value from left to right.
## Cost analysis
The scan uses O(n) time and O(1) auxiliary space.
## Optimized approach
Stop immediately after finding the first matching value.
## Invariant and correctness
The result is first because every earlier index was already rejected.
## Final complexity
Worst-case runtime is O(n) time and auxiliary usage is O(1) space.
## Post-pass reflection
<!-- Optional -->
`
    expect(validateAnalysisText({ id: '01-example' }, legacy)).toEqual([])
  })

  it('requires both final-simulation parts in the algorithm notes', () => {
    expect(
      validateAnalysisText({ id: '24-final-interview-simulation' }, completeAnalysis),
    ).toHaveLength(2)
    const bothParts = completeAnalysis
      .replace('Scan candidates', 'Part A and Part B scan candidates')
      .replace('The result', 'Part A and Part B: the result')
    expect(validateAnalysisText({ id: '24-final-interview-simulation' }, bothParts)).toEqual([])
  })
})
