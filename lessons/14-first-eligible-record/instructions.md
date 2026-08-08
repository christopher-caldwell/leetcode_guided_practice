# 14. Find the First Eligible Record

## Interview skill being developed

boundary binary search, monotonic predicates, candidate preservation. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 13.

## Problem statement

Given a nondecreasing array, return the first index whose value is at least threshold. Return -1 if no such index exists. The verifier requires logarithmic scaling.

### Examples

- `firstAtLeast([1, 3, 3, 7], 3) -> 1`
- `firstAtLeast([1, 2], 5) -> -1`

### Constraints

- 0 <= values.length <= 1,000,000
- Duplicate values are allowed.
- Do not mutate input.

## Contract checks

- Does at least include equality?
- Which duplicate index is required?
- Can threshold fall below every value?

These are prompts, not required individual answers. In `lessons/14-first-eligible-record/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/14-first-eligible-record/learner_analysis.md`
- Implementation: `lessons/14-first-eligible-record/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/14-first-eligible-record/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Returning immediately on equality without proving it is the first.
- Discarding a qualifying midpoint that might be the answer.
- Using an exact-match search for a threshold absent from the array.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return the insertion position from 0 through values.length instead of -1?

Do not code the variation unless you want extra practice.
