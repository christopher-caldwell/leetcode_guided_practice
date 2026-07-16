# 13. Locate an Exact Sorted Record

## Interview skill being developed

binary search, search intervals, logarithmic complexity. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Array indexing and explicit loop invariants.

## Problem statement

Given a strictly increasing array and target, return its index or -1. The verifier requires logarithmic scaling.

### Examples

- `binarySearch([-2, 0, 4, 9], 4) -> 2`
- `binarySearch([1, 3], 2) -> -1`

### Constraints

- 0 <= values.length <= 1,000,000
- Values are strictly increasing.
- Do not mutate input.

## Clarifying questions to consider

- Are duplicate values possible?
- Which absence sentinel is required?
- Are interval boundaries inclusive or exclusive?

Write your actual assumptions and answers in `lessons/13-exact-sorted-lookup/analysis.md` before coding.

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

- Reasoning: `lessons/13-exact-sorted-lookup/analysis.md`
- Implementation: `lessons/13-exact-sorted-lookup/solutions/typescript/solution.ts`
- Visible examples: `lessons/13-exact-sorted-lookup/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Mixing inclusive and exclusive boundary conventions.
- Failing to remove the inspected midpoint from the next interval.
- Computing a midpoint without flooring it.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would duplicate values change the contract if the first matching index were required?

Do not code the variation unless you want extra practice.
