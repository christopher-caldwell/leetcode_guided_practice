# 02. Pair Sum: Establish a Baseline

## Interview skill being developed

brute-force baselines, nested-loop cost, distinct-index contracts. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 1 and the ability to trace a loop.

## Problem statement

Return indices of two distinct elements whose values sum to target. Either index order is valid. Return null if no pair exists, and do not mutate the input. For this lesson, deliberately implement the straightforward exhaustive baseline with nested loops; the later Map optimization belongs to Lesson 3.

### Examples

- `pairSumBaseline([2, 7, 11], 9) -> [0, 1]`
- `pairSumBaseline([1], 2) -> null`

### Constraints

- 0 <= nums.length <= 2,000
- Exactly one or zero valid pairs exist.
- An index cannot be used twice.
- The returned pair may list its two indices in either order.
- The input must remain unchanged.

## Contract checks

- Are duplicate values allowed?
- Can one element be paired with itself?
- What result represents no solution?

These are prompts, not required individual answers. In `lessons/02-pair-sum-baseline/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/02-pair-sum-baseline/analysis.md`
- Implementation: `lessons/02-pair-sum-baseline/solutions/typescript/solution.ts`
- Visible examples: `lessons/02-pair-sum-baseline/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

## Common traps

- Comparing an index with itself.
- Checking the same unordered pair twice.
- Calling the nested-loop cost O(n) because each loop is individually linear.

## Optional follow-up

After the lesson advances, consider this variation:

> If every valid pair were required, what would change about the output and lower bound?

Do not code the variation unless you want extra practice.
