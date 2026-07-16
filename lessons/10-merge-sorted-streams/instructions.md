# 10. Merge Sorted Event Streams

## Interview skill being developed

linked-list traversal, pointer invariants, sentinel nodes. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Two-pointer reasoning from Lesson 5. ListNode is supplied.

## Problem statement

Merge two nondecreasing singly linked lists into one nondecreasing list. Reuse existing nodes; do not allocate replacement nodes except an optional sentinel.

### Examples

- `[1, 2, 4] plus [1, 3, 4] -> [1, 1, 2, 3, 4, 4]`
- `null plus [0] -> [0]`

### Constraints

- 0 <= combined node count <= 50,000
- Node values may be negative.
- Inputs contain no cycles.

## Clarifying questions to consider

- May existing nodes be relinked?
- What should happen when one list is empty?
- Must equal values preserve their original cross-list order?

Write your actual assumptions and answers in `lessons/10-merge-sorted-streams/analysis.md` before coding.

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

- Reasoning: `lessons/10-merge-sorted-streams/analysis.md`
- Implementation: `lessons/10-merge-sorted-streams/solutions/typescript/solution.ts`
- Visible examples: `lessons/10-merge-sorted-streams/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Losing the remaining portion after changing a next pointer.
- Returning the moving tail instead of the merged head.
- Forgetting that one list can have unconsumed nodes after the other ends.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would you merge k sorted linked lists, and which operation becomes the bottleneck?

Do not code the variation unless you want extra practice.
