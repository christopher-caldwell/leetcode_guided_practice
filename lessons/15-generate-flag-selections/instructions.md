# 15. Generate Feature-Flag Selections

## Interview skill being developed

recursion, backtracking, decision trees, state restoration. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Basic recursion and array copying.

## Problem statement

Given distinct numbers, return every possible subset in any order. Each subset may be in any order, but no subset may be duplicated.

### Examples

- `generateSubsets([1, 2]) -> [[], [1], [2], [1, 2]]`
- `generateSubsets([]) -> [[]]`

### Constraints

- 0 <= values.length <= 15
- Input values are distinct.
- Do not mutate input.

## Contract checks

- Is the empty subset included?
- Does result ordering matter?
- Why is n capped at 15?

These are prompts, not required individual answers. In `lessons/15-generate-flag-selections/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/15-generate-flag-selections/analysis.md`
- Implementation: `lessons/15-generate-flag-selections/solutions/typescript/solution.ts`
- Visible examples: `lessons/15-generate-flag-selections/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

## Common traps

- Pushing the same mutable array reference into every result.
- Forgetting to restore a choice before exploring another branch.
- Calling exponential output a performance bug when the output itself has exponential size.

## Optional follow-up

After the lesson advances, consider this variation:

> How would duplicate input values change the generation process and uniqueness requirement?

Do not code the variation unless you want extra practice.
