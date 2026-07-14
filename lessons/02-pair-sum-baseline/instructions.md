# 02. Pair Sum: Establish a Baseline

## Interview skill being developed

brute-force baselines, nested-loop cost, distinct-index contracts. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 1 and the ability to trace a loop.

## Problem statement

Return indices of two distinct elements whose values sum to target. Return null if no pair exists. For this lesson, deliberately implement the straightforward exhaustive baseline.

### Examples

- `pairSumBaseline([2, 7, 11], 9) -> [0, 1]`
- `pairSumBaseline([1], 2) -> null`

### Constraints

- 0 <= nums.length <= 2,000
- Exactly one or zero valid pairs exist.
- An index cannot be used twice.

## Clarifying questions to consider

- Are duplicate values allowed?
- Can one element be paired with itself?
- What result represents no solution?

Write your actual assumptions and answers in `lessons/02-pair-sum-baseline/analysis.md` before coding.

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

- Reasoning: `lessons/02-pair-sum-baseline/analysis.md`
- Implementation: `lessons/02-pair-sum-baseline/solutions/typescript/solution.ts`
- Visible examples: `lessons/02-pair-sum-baseline/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Comparing an index with itself.
- Checking the same unordered pair twice.
- Calling the nested-loop cost O(n) because each loop is individually linear.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> If every valid pair were required, what would change about the output and lower bound?

Do not code the variation unless you want extra practice.
