# 19. Retain the Highest-Priority Items

## Interview skill being developed

heaps, priority queues, top-k selection, bounded retained state. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Frequency maps from Lesson 4. A tested MinPriorityQueue is supplied.

## Problem statement

Return the k most frequent numbers in any order. At least k distinct numbers exist. Use the supplied priority queue and avoid sorting all distinct values.

When frequencies tie at the kth cutoff, any k values whose frequencies are at least that cutoff are valid; output order does not matter.

### Examples

- `topKFrequent([1, 1, 1, 2, 2, 3], 2) -> [1, 2] in any order`
- `topKFrequent([4], 1) -> [4]`

### Constraints

- 1 <= values.length <= 100,000
- 1 <= k <= number of distinct values
- Values may be negative.

## Contract checks

- Does output order matter?
- Can frequencies tie?
- What does k bound: input values or distinct values?

These are prompts, not required individual answers. In `lessons/19-highest-priority-items/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/19-highest-priority-items/analysis.md`
- Implementation: `lessons/19-highest-priority-items/solutions/typescript/solution.ts`
- Visible examples: `lessons/19-highest-priority-items/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

The verifier requires construction of the supplied `MinPriorityQueue`, rejects `.sort()`/`.toSorted()` inside `topKFrequent`, and exercises small k against many distinct values.

## Common traps

- Using the numeric value as heap priority instead of its frequency.
- Keeping the least useful side of the priority queue.
- Calling heap construction O(1) because its API is supplied.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the tradeoff change if values arrived as an unbounded stream?

Do not code the variation unless you want extra practice.
