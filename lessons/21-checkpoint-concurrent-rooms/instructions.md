# 21. Checkpoint IV: Concurrent Rooms

## Interview skill being developed

mixed retrieval, resource-lifetime reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 17–20. The relevant pattern is intentionally not announced.

## Problem statement

Return the minimum number of rooms required for all half-open meetings [start, end). A meeting ending at time t frees its room for one starting at t. Do not mutate input.

### Examples

- `minimumConcurrentRooms([[0, 30], [5, 10], [15, 20]]) -> 2`
- `minimumConcurrentRooms([[7, 10], [10, 12]]) -> 1`

### Constraints

- 0 <= meetings.length <= 100,000
- start < end
- Input order is arbitrary.

## Clarifying questions to consider

- Can a room be reused at an equal endpoint?
- Is the desired value total meetings or peak concurrency?
- May meetings be sorted in place?

Write your actual assumptions and answers in `lessons/21-checkpoint-concurrent-rooms/analysis.md` before coding.

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

- Reasoning: `lessons/21-checkpoint-concurrent-rooms/analysis.md`
- Implementation: `lessons/21-checkpoint-concurrent-rooms/solutions/typescript/solution.ts`
- Visible examples: `lessons/21-checkpoint-concurrent-rooms/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Treating touching half-open meetings as overlapping.
- Tracking every finished room when only reusable capacity matters.
- Returning the final active count instead of the peak resource count.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would you also assign a concrete room identifier to every meeting?

Do not code the variation unless you want extra practice.
