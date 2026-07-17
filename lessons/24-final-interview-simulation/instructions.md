# 24. Final Mixed Interview Simulation

## Interview skill being developed

unannounced mixed retrieval, interview communication, transfer under time pressure. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 1–23. Relevant patterns are intentionally not announced.

## Problem statement

Complete both parts. Part A returns the inclusive boundaries of the shortest contiguous event range containing every required identifier with multiplicity, or null when the requirement is empty or impossible. If multiple minimum ranges have equal length, return the one with the earliest start. Part B returns the fewest undirected edges between two services, or -1 when unreachable.

### Examples

- `smallestCoveringRange(['a', 'b', 'c', 'a'], ['a', 'c']) -> [2, 3]`
- `shortestRoute(5, [[0, 1], [1, 2], [0, 3]], 3, 2) -> 3`

### Constraints

- Each event/edge collection may contain 100,000 entries.
- Required identifiers may repeat.
- Services are numbered 0 through serviceCount - 1.
- Do not mutate inputs.

## Contract checks

- How are equal-length covering ranges tied?
- Does required multiplicity matter?
- Does a route from a service to itself use zero edges?

These are prompts, not required individual answers. In `lessons/24-final-interview-simulation/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/24-final-interview-simulation/analysis.md`
- Implementation: `lessons/24-final-interview-simulation/solutions/typescript/solution.ts`
- Visible examples: `lessons/24-final-interview-simulation/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

The final verifier includes an adjacency-order counterexample for DFS discovery depth, a guarded 20,000-event covering-range case, and a 20,000-service route.

## Common traps

- Treating required identifiers as a Set and losing multiplicity.
- Returning the first valid covering range without proving it is shortest.
- Using depth-first discovery depth as an unweighted shortest-path guarantee.

## Optional follow-up

After the lesson advances, consider this variation:

> How would Part B change if connections had nonnegative travel times?

Do not code the variation unless you want extra practice.
