# 13. Locate an Exact Sorted Record

## Interview skill being developed

binary search, search intervals, logarithmic complexity. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Array indexing and explicit loop invariants.

## Problem statement

Given a strictly increasing array and target, return its index or -1. The verifier requires logarithmic scaling.

### Examples

- `binarySearch([-2, 0, 4, 9], 4) -> 2`
- `binarySearch([1, 3], 2) -> -1`

### Constraints

- 0 <= values.length <= 1,000,000
- Values are strictly increasing.
- Do not mutate input.

## Contract checks

- Are duplicate values possible?
- Which absence sentinel is required?
- Are interval boundaries inclusive or exclusive?

These are prompts, not required individual answers. In `lessons/13-exact-sorted-lookup/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/13-exact-sorted-lookup/learner_analysis.md`
- Implementation: `lessons/13-exact-sorted-lookup/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/13-exact-sorted-lookup/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Mixing inclusive and exclusive boundary conventions.
- Failing to remove the inspected midpoint from the next interval.
- Computing a midpoint without flooring it.

## Optional follow-up

After the lesson advances, consider this variation:

> How would duplicate values change the contract if the first matching index were required?

Do not code the variation unless you want extra practice.
