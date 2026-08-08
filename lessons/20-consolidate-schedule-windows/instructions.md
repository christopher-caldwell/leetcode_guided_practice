# 20. Consolidate Schedule Windows

## Interview skill being developed

sorting as preprocessing, interval merging, output-tail invariants. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Array traversal and comparison functions.

## Problem statement

Merge every overlapping schedule window. Each window is [start, end] with start <= end. Touching endpoints count as overlap. Return the merged windows in ascending start order. Do not mutate the input or its nested tuples.

### Examples

- `mergeWindows([[1, 3], [2, 6], [8, 10]]) -> [[1, 6], [8, 10]]`
- `mergeWindows([[1, 4], [4, 5]]) -> [[1, 5]]`

### Constraints

- 0 <= windows.length <= 100,000
- Endpoints may be negative.
- Input order is arbitrary.
- Output is ordered by ascending start value.

## Contract checks

- Do touching endpoints overlap?
- May the input be reordered or mutated?
- What output order is expected?

These are prompts, not required individual answers. In `lessons/20-consolidate-schedule-windows/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/20-consolidate-schedule-windows/learner_analysis.md`
- Implementation: `lessons/20-consolidate-schedule-windows/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/20-consolidate-schedule-windows/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Scanning arbitrary-order intervals without first creating a useful order.
- Replacing an end rather than taking the larger end for nested intervals.
- Mutating caller-owned nested tuples while sorting or merging.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you insert and merge one new interval when existing windows are already sorted and disjoint?

Do not code the variation unless you want extra practice.
