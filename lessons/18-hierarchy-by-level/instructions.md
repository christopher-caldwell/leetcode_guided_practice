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
- Use an indexed queue or another O(1)-amortized front-removal strategy; do not use repeated `Array.shift()`.

## Contract checks

- Is grouping by level part of the output contract?
- Which child order is required?
- How should empty input be represented?

These are prompts, not required individual answers. In `lessons/18-hierarchy-by-level/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/18-hierarchy-by-level/learner_analysis.md`
- Implementation: `lessons/18-hierarchy-by-level/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/18-hierarchy-by-level/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

A broad-tree scaling case and focused source policy reject repeated `Array.shift()` front removal.

## Common traps

- Using Array.shift repeatedly and accidentally introducing avoidable copying cost.
- Mixing children added during a level with nodes belonging to that level.
- Returning one flat traversal instead of grouped levels.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return only the rightmost value visible at each depth?

Do not code the variation unless you want extra practice.
