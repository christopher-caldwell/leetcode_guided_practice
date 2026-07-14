# 18. Process a Hierarchy by Level

## Interview skill being developed

queues, breadth-first search, level boundaries. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 17 and array-based queue mechanics.

## Problem statement

Return binary-tree values grouped by depth from left to right. Empty input returns an empty array. Do not mutate nodes.

### Examples

- `Tree [3, 9, 20, null, null, 15, 7] -> [[3], [9, 20], [15, 7]]`
- `levelOrder(null) -> []`

### Constraints

- 0 <= node count <= 100,000
- The tree may be skewed.
- Preserve left-to-right order within a level.

## Clarifying questions to consider

- Is grouping by level part of the output contract?
- Which child order is required?
- How should empty input be represented?

Write your actual assumptions and answers in `lessons/18-hierarchy-by-level/analysis.md` before coding.

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

- Reasoning: `lessons/18-hierarchy-by-level/analysis.md`
- Implementation: `lessons/18-hierarchy-by-level/solutions/typescript/solution.ts`
- Visible examples: `lessons/18-hierarchy-by-level/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Using Array.shift repeatedly and accidentally introducing avoidable copying cost.
- Mixing children added during a level with nodes belonging to that level.
- Returning one flat traversal instead of grouped levels.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would you return only the rightmost value visible at each depth?

Do not code the variation unless you want extra practice.
