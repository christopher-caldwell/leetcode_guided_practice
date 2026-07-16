# 11. Checkpoint II: Longest Stable Segment

## Interview skill being developed

mixed retrieval, invariant-driven optimization. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 7–10. The relevant pattern is intentionally not announced.

## Problem statement

Return the length of the longest contiguous event segment containing no more than allowedKinds distinct identifiers. Return 0 for empty input or when allowedKinds is nonpositive.

### Examples

- `longestStableSegment(['a', 'b', 'a', 'c'], 2) -> 3`
- `longestStableSegment(['a', 'a'], 1) -> 2`

### Constraints

- 0 <= events.length <= 100,000
- 0 <= allowedKinds <= 100,000
- Do not mutate input.

## Clarifying questions to consider

- Does no more than permit fewer kinds?
- Must the result be contiguous?
- What should nonpositive allowedKinds return?

Write your actual assumptions and answers in `lessons/11-checkpoint-stable-segment/analysis.md` before coding.

## Expected workflow

1. Restate the contract and walk through a small example.
2. Propose a correct baseline, even if it is too expensive.
3. Define `n` and analyze the baseline's time and auxiliary space.
4. Identify the repeated or expensive operation.
5. Derive an optimization and state its invariant.
6. Implement only inside the TODO boundary.
7. Run `just check`, inspect the failure category, and test your own edge cases.
8. Explain why the final algorithm is correct and state its complexity.

## Editable files and TODO boundary

- Reasoning: `lessons/11-checkpoint-stable-segment/analysis.md`
- Implementation: `lessons/11-checkpoint-stable-segment/solutions/typescript/solution.ts`
- Visible examples: `lessons/11-checkpoint-stable-segment/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Keeping a segment after its distinct-kind constraint has been violated.
- Removing an identifier before its final occurrence leaves the segment.
- Rebuilding distinct counts for every candidate segment.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would you return the segment boundaries and resolve ties by earliest start?

Do not code the variation unless you want extra practice.
