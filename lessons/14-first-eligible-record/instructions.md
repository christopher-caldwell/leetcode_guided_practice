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

## Clarifying questions to consider

- Does at least include equality?
- Which duplicate index is required?
- Can threshold fall below every value?

Write your actual assumptions and answers in `lessons/14-first-eligible-record/analysis.md` before coding.

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

- Reasoning: `lessons/14-first-eligible-record/analysis.md`
- Implementation: `lessons/14-first-eligible-record/solutions/typescript/solution.ts`
- Visible examples: `lessons/14-first-eligible-record/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Returning immediately on equality without proving it is the first.
- Discarding a qualifying midpoint that might be the answer.
- Using an exact-match search for a threshold absent from the array.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would you return the insertion position from 0 through values.length instead of -1?

Do not code the variation unless you want extra practice.
