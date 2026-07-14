# 20. Consolidate Schedule Windows

## Interview skill being developed

sorting as preprocessing, interval merging, output-tail invariants. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Array traversal and comparison functions.

## Problem statement

Merge every overlapping schedule window. Each window is [start, end] with start <= end. Touching endpoints count as overlap. Do not mutate the input or its nested tuples.

### Examples

- `mergeWindows([[1, 3], [2, 6], [8, 10]]) -> [[1, 6], [8, 10]]`
- `mergeWindows([[1, 4], [4, 5]]) -> [[1, 5]]`

### Constraints

- 0 <= windows.length <= 100,000
- Endpoints may be negative.
- Input order is arbitrary.

## Clarifying questions to consider

- Do touching endpoints overlap?
- May the input be reordered or mutated?
- What output order is expected?

Write your actual assumptions and answers in `lessons/20-consolidate-schedule-windows/analysis.md` before coding.

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

- Reasoning: `lessons/20-consolidate-schedule-windows/analysis.md`
- Implementation: `lessons/20-consolidate-schedule-windows/solutions/typescript/solution.ts`
- Visible examples: `lessons/20-consolidate-schedule-windows/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Scanning arbitrary-order intervals without first creating a useful order.
- Replacing an end rather than taking the larger end for nested intervals.
- Mutating caller-owned nested tuples while sorting or merging.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would you insert and merge one new interval when existing windows are already sorted and disjoint?

Do not code the variation unless you want extra practice.
