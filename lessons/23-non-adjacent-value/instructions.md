# 23. Maximize Non-Adjacent Value

## Interview skill being developed

dynamic programming, state transitions, space optimization. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Baseline decomposition and comfort with array iteration.

## Problem statement

Select values from an array to maximize their sum without selecting adjacent indices. Selecting nothing is allowed, so arrays containing only negative values return 0.

### Examples

- `maxNonAdjacentValue([2, 7, 9, 3, 1]) -> 12`
- `maxNonAdjacentValue([-2, -1]) -> 0`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative.
- Do not mutate input.
- Use O(1) auxiliary state beyond the input and return value.

## Contract checks

- Is selecting no values permitted?
- Does adjacency refer to indices or numeric values?
- Are selected positions or only the sum required?

These are prompts, not required individual answers. In `lessons/23-non-adjacent-value/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/23-non-adjacent-value/learner_analysis.md`
- Implementation: `lessons/23-non-adjacent-value/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/23-non-adjacent-value/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

A focused TypeScript source policy enforces scalar O(1) auxiliary state instead of a full dynamic-programming table.

## Common traps

- Greedily taking the largest remaining value without considering its neighbors.
- Defining state without enough information to make the next decision.
- Using an O(n) table without recognizing which prior states are actually needed.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the transition change if the first and last indices were also considered adjacent?

Do not code the variation unless you want extra practice.
