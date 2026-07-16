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

## Clarifying questions to consider

- What should happen for an empty array?
- Does first mean the lowest index?
- May the function mutate its input?

Write your actual assumptions and answers in `lessons/01-linear-scan/analysis.md` before coding.

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

- Reasoning: `lessons/01-linear-scan/analysis.md`
- Implementation: `lessons/01-linear-scan/solutions/typescript/solution.ts`
- Visible examples: `lessons/01-linear-scan/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Returning a value instead of its index.
- Continuing to scan after the first match.
- Describing the cost without defining n.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would the contract and complexity change if all matching indices were required?

Do not code the variation unless you want extra practice.
