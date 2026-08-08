# 22. Count Disconnected Service Groups

## Interview skill being developed

graph representation, DFS or BFS, connected components, visited sets. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Tree traversal from Lessons 17–18.

## Problem statement

Services are numbered 0 through serviceCount - 1. Undirected connections link services. Duplicate, reversed, and self-connections may occur. Return the number of connected groups, including isolated services, without mutating the connection list or its tuples.

### Examples

- `countServiceGroups(5, [[0, 1], [1, 2], [3, 4]]) -> 2`
- `countServiceGroups(3, []) -> 3`

### Constraints

- 0 <= serviceCount <= 100,000
- 0 <= connections.length <= 200,000
- No endpoint lies outside the service range.
- Duplicate, reversed, and self-connections are valid input.
- The input and its nested connection tuples must remain unchanged.
- Use iterative DFS or BFS so a worst-case 100,000-service chain does not overflow the JavaScript call stack.

## Contract checks

- Are connections directed or undirected?
- Do isolated services count as groups?
- Can duplicate connections or self-connections occur?

These are prompts, not required individual answers. In `lessons/22-disconnected-service-groups/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/22-disconnected-service-groups/learner_analysis.md`
- Implementation: `lessons/22-disconnected-service-groups/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/22-disconnected-service-groups/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Beginning traversal only from nodes that appear in an edge.
- Adding only one direction to an undirected adjacency structure.
- Marking visited too late and enqueuing the same node repeatedly.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the result change if connections were directed and strongly connected groups were required?

Do not code the variation unless you want extra practice.
