# 23. Maximize Non-Adjacent Value

## Interview skill being developed

dynamic programming, state transitions, space optimization. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Baseline decomposition and comfort with array iteration.

## Problem statement

Select values from an array to maximize their sum without selecting adjacent indices. Selecting nothing is allowed, so arrays containing only negative values return 0.

### Examples

- `maxNonAdjacentValue([2, 7, 9, 3, 1]) -> 12`
- `maxNonAdjacentValue([-2, -1]) -> 0`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative.
- Do not mutate input.
- Use O(1) auxiliary state beyond the input and return value.

## Clarifying questions to consider

- Is selecting no values permitted?
- Does adjacency refer to indices or numeric values?
- Are selected positions or only the sum required?

Write your actual assumptions and answers in `lessons/23-non-adjacent-value/analysis.md` before coding.

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

- Reasoning: `lessons/23-non-adjacent-value/analysis.md`
- Implementation: `lessons/23-non-adjacent-value/solutions/typescript/solution.ts`
- Visible examples: `lessons/23-non-adjacent-value/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

A focused TypeScript source policy enforces scalar O(1) auxiliary state instead of a full dynamic-programming table.

## Common traps

- Greedily taking the largest remaining value without considering its neighbors.
- Defining state without enough information to make the next decision.
- Using an O(n) table without recognizing which prior states are actually needed.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would the transition change if the first and last indices were also considered adjacent?

Do not code the variation unless you want extra practice.
