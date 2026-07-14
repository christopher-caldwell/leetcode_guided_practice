# 06. Checkpoint I: Nearby Repeated Events

## Interview skill being developed

mixed retrieval, constraint-driven data-structure selection. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 1–5. The relevant pattern is intentionally not announced.

## Problem statement

Given an event stream and maximum index distance, return true when the same event appears at two distinct indices no farther apart than maxDistance.

### Examples

- `hasNearbyRepeat(['login', 'view', 'login'], 2) -> true`
- `hasNearbyRepeat(['a', 'b', 'a'], 1) -> false`

### Constraints

- 0 <= events.length <= 100,000
- 0 <= maxDistance <= 100,000
- Do not mutate the input.

## Clarifying questions to consider

- Is distance measured by index difference?
- Can maxDistance be zero?
- Do we need the pair or only its existence?

Write your actual assumptions and answers in `lessons/06-checkpoint-nearby-events/analysis.md` before coding.

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

- Reasoning: `lessons/06-checkpoint-nearby-events/analysis.md`
- Implementation: `lessons/06-checkpoint-nearby-events/solutions/typescript/solution.ts`
- Visible examples: `lessons/06-checkpoint-nearby-events/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Comparing every pair despite the input bound.
- Forgetting that a later occurrence may be closer than an earlier one.
- Treating equal strings at one index as two events.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would you return the closest repeated pair instead of a boolean?

Do not code the variation unless you want extra practice.
