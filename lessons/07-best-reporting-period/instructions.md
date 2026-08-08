# 07. Best Fixed Reporting Period

## Interview skill being developed

fixed sliding windows, incremental aggregates, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Comfort with array indexing and Lesson 2 cost analysis.

## Problem statement

Return the largest sum among all contiguous windows of exactly windowSize values. Return null when windowSize is nonpositive or larger than the input.

### Examples

- `maxWindowSum([2, 1, 5, 1, 3], 3) -> 9`
- `maxWindowSum([-4, -2], 1) -> -2`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative.
- Do not mutate the input.

## Contract checks

- Must selected values be contiguous?
- How is an invalid window size represented?
- Can the best sum be negative?

These are prompts, not required individual answers. In `lessons/07-best-reporting-period/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/07-best-reporting-period/learner_analysis.md`
- Implementation: `lessons/07-best-reporting-period/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/07-best-reporting-period/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

An indexed-read budget rejects recomputing every large window from scratch.

## Common traps

- Initializing the best sum to zero when all values may be negative.
- Recomputing every complete window from scratch.
- Off-by-one errors when the outgoing value leaves the window.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return the starting index of the best window as well as its sum?

Do not code the variation unless you want extra practice.
