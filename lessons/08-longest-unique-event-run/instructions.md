# 08. Longest Unique Event Run

## Interview skill being developed

variable sliding windows, window invariants, last-seen information. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 3, 6, and 7.

## Problem statement

Return the length of the longest contiguous portion of an event stream containing no repeated event identifier.

### Examples

- `longestUniqueRun(['a', 'b', 'c', 'a', 'b']) -> 3`
- `longestUniqueRun(['x', 'x']) -> 1`

### Constraints

- 0 <= events.length <= 100,000
- Identifiers are case-sensitive.
- Do not mutate the input.

## Clarifying questions to consider

- Is the result a length or the segment itself?
- Does contiguous matter?
- What is the empty-input result?

Write your actual assumptions and answers in `lessons/08-longest-unique-event-run/analysis.md` before coding.

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

- Reasoning: `lessons/08-longest-unique-event-run/analysis.md`
- Implementation: `lessons/08-longest-unique-event-run/solutions/typescript/solution.ts`
- Visible examples: `lessons/08-longest-unique-event-run/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Resetting the entire candidate segment after a duplicate.
- Moving the left boundary backward because of an old occurrence.
- Confusing a subsequence with a contiguous window.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would the invariant change if at most two occurrences of each event were permitted?

Do not code the variation unless you want extra practice.
