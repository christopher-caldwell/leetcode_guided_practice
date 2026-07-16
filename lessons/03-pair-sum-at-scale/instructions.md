# 03. Pair Sum at Scale

## Interview skill being developed

hash-map lookup, complements, time-space tradeoffs, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 2 and basic TypeScript Map usage.

## Problem statement

Solve the same distinct-index pair-sum contract, but inputs may contain 100,000 values. Use a `Map` to retain the information needed for constant-average-time complement lookup; the verifier rejects work proportional to every possible pair.

### Examples

- `pairSumAtScale([3, 2, 4], 6) -> [1, 2]`
- `pairSumAtScale([3, 3], 6) -> [0, 1]`

### Constraints

- 0 <= nums.length <= 100,000
- Values and target may be negative.
- Return null if impossible.

## Clarifying questions to consider

- Which result ordering is acceptable?
- How do duplicate values affect stored information?
- What operation would let one element rule in a partner immediately?

Write your actual assumptions and answers in `lessons/03-pair-sum-at-scale/analysis.md` before coding.

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

- Reasoning: `lessons/03-pair-sum-at-scale/analysis.md`
- Implementation: `lessons/03-pair-sum-at-scale/solutions/typescript/solution.ts`
- Visible examples: `lessons/03-pair-sum-at-scale/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

The verifier also confirms that `pairSumAtScale` constructs the required `Map`; small output examples alone cannot distinguish it from a copied quadratic scan.

## Common traps

- Inserting the current value before checking and accidentally reusing its index.
- Storing values without enough information to return indices.
- Claiming constant space while retaining information proportional to n.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would you adapt the approach if the input were already sorted but original indices were unnecessary?

Do not code the variation unless you want extra practice.
