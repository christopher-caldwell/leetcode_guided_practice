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

## Clarifying questions to consider

- Is the empty subset included?
- Does result ordering matter?
- Why is n capped at 15?

Write your actual assumptions and answers in `lessons/15-generate-flag-selections/analysis.md` before coding.

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

- Reasoning: `lessons/15-generate-flag-selections/analysis.md`
- Implementation: `lessons/15-generate-flag-selections/solutions/typescript/solution.ts`
- Visible examples: `lessons/15-generate-flag-selections/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Pushing the same mutable array reference into every result.
- Forgetting to restore a choice before exploring another branch.
- Calling exponential output a performance bug when the output itself has exponential size.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would duplicate input values change the generation process and uniqueness requirement?

Do not code the variation unless you want extra practice.
