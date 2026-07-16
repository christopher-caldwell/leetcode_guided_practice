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

## Clarifying questions to consider

- How are equal-length covering ranges tied?
- Does required multiplicity matter?
- Does a route from a service to itself use zero edges?

Write your actual assumptions and answers in `lessons/24-final-interview-simulation/analysis.md` before coding. In the Baseline, Cost, Optimized, Invariant, and Final Complexity sections, label and address both `Part A` and `Part B` explicitly.

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

- Reasoning: `lessons/24-final-interview-simulation/analysis.md`
- Implementation: `lessons/24-final-interview-simulation/solutions/typescript/solution.ts`
- Visible examples: `lessons/24-final-interview-simulation/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

The final verifier includes an adjacency-order counterexample for DFS discovery depth, a guarded 20,000-event covering-range case, and a 20,000-service route.

## Common traps

- Treating required identifiers as a Set and losing multiplicity.
- Returning the first valid covering range without proving it is shortest.
- Using depth-first discovery depth as an unweighted shortest-path guarantee.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would Part B change if connections had nonnegative travel times?

Do not code the variation unless you want extra practice.
