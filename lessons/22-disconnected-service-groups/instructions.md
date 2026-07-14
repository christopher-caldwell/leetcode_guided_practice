# 22. Count Disconnected Service Groups

## Interview skill being developed

graph representation, DFS or BFS, connected components, visited sets. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Tree traversal from Lessons 17–18.

## Problem statement

Services are numbered 0 through serviceCount - 1. Undirected connections link services. Return the number of connected groups, including isolated services.

### Examples

- `countServiceGroups(5, [[0, 1], [1, 2], [3, 4]]) -> 2`
- `countServiceGroups(3, []) -> 3`

### Constraints

- 0 <= serviceCount <= 100,000
- 0 <= connections.length <= 200,000
- No endpoint lies outside the service range.

## Clarifying questions to consider

- Are connections directed or undirected?
- Do isolated services count as groups?
- Can duplicate connections or self-connections occur?

Write your actual assumptions and answers in `lessons/22-disconnected-service-groups/analysis.md` before coding.

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

- Reasoning: `lessons/22-disconnected-service-groups/analysis.md`
- Implementation: `lessons/22-disconnected-service-groups/solutions/typescript/solution.ts`
- Visible examples: `lessons/22-disconnected-service-groups/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Beginning traversal only from nodes that appear in an edge.
- Adding only one direction to an undirected adjacency structure.
- Marking visited too late and enqueuing the same node repeatedly.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would the result change if connections were directed and strongly connected groups were required?

Do not code the variation unless you want extra practice.
