# 19. Retain the Highest-Priority Items

## Interview skill being developed

heaps, priority queues, top-k selection, bounded retained state. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Frequency maps from Lesson 4. A tested MinPriorityQueue is supplied.

## Problem statement

Return the k most frequent numbers in any order. At least k distinct numbers exist. Use the supplied priority queue and avoid sorting all distinct values.

### Examples

- `topKFrequent([1, 1, 1, 2, 2, 3], 2) -> [1, 2] in any order`
- `topKFrequent([4], 1) -> [4]`

### Constraints

- 1 <= values.length <= 100,000
- 1 <= k <= number of distinct values
- Values may be negative.

## Clarifying questions to consider

- Does output order matter?
- Can frequencies tie?
- What does k bound: input values or distinct values?

Write your actual assumptions and answers in `lessons/19-highest-priority-items/analysis.md` before coding.

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

- Reasoning: `lessons/19-highest-priority-items/analysis.md`
- Implementation: `lessons/19-highest-priority-items/solutions/typescript/solution.ts`
- Visible examples: `lessons/19-highest-priority-items/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Using the numeric value as heap priority instead of its frequency.
- Keeping the least useful side of the priority queue.
- Calling heap construction O(1) because its API is supplied.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would the tradeoff change if values arrived as an unbounded stream?

Do not code the variation unless you want extra practice.
