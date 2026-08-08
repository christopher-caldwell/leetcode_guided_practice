# 01. Find the First Matching Record

## Interview skill being developed

input contracts, linear scans, operation counting, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Comfort reading and writing a TypeScript loop.

## Problem statement

Given an array of numbers and a target, return the index of the first matching value. Return -1 when the target is absent. Do not mutate the input.

### Examples

- `findFirstIndex([4, 8, 4], 4) -> 0`
- `findFirstIndex([4, 8], 3) -> -1`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative or duplicated.

## Contract checks

- What should happen for an empty array?
- Does first mean the lowest index?
- May the function mutate its input?

These are prompts, not required individual answers. In `lessons/01-linear-scan/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/01-linear-scan/learner_analysis.md`
- Implementation: `lessons/01-linear-scan/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/01-linear-scan/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Returning a value instead of its index.
- Continuing to scan after the first match.
- Describing the cost without defining n.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the contract and complexity change if all matching indices were required?

Do not code the variation unless you want extra practice.
