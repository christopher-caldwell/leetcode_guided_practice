# 07. Best Fixed Reporting Period

## Interview skill being developed

fixed sliding windows, incremental aggregates, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Comfort with array indexing and Lesson 2 cost analysis.

## Problem statement

Return the largest sum among all contiguous windows of exactly windowSize values. Return null when windowSize is nonpositive or larger than the input.

### Examples

- `maxWindowSum([2, 1, 5, 1, 3], 3) -> 9`
- `maxWindowSum([-4, -2], 1) -> -2`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative.
- Do not mutate the input.

## Clarifying questions to consider

- Must selected values be contiguous?
- How is an invalid window size represented?
- Can the best sum be negative?

Write your actual assumptions and answers in `lessons/07-best-reporting-period/analysis.md` before coding.

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

- Reasoning: `lessons/07-best-reporting-period/analysis.md`
- Implementation: `lessons/07-best-reporting-period/solutions/typescript/solution.ts`
- Visible examples: `lessons/07-best-reporting-period/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Initializing the best sum to zero when all values may be negative.
- Recomputing every complete window from scratch.
- Off-by-one errors when the outgoing value leaves the window.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would you return the starting index of the best window as well as its sum?

Do not code the variation unless you want extra practice.
