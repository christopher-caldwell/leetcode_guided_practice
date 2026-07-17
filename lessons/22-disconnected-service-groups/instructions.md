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

## Contract checks

- Are connections directed or undirected?
- Do isolated services count as groups?
- Can duplicate connections or self-connections occur?

These are prompts, not required individual answers. In `lessons/22-disconnected-service-groups/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/22-disconnected-service-groups/analysis.md`
- Implementation: `lessons/22-disconnected-service-groups/solutions/typescript/solution.ts`
- Visible examples: `lessons/22-disconnected-service-groups/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

## Common traps

- Beginning traversal only from nodes that appear in an edge.
- Adding only one direction to an undirected adjacency structure.
- Marking visited too late and enqueuing the same node repeatedly.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the result change if connections were directed and strongly connected groups were required?

Do not code the variation unless you want extra practice.
