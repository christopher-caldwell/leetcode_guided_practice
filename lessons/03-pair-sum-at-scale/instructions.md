# 03. Pair Sum at Scale

## Interview skill being developed

hash-map lookup, complements, time-space tradeoffs, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 2 and basic TypeScript Map usage.

## Problem statement

Solve the same distinct-index pair-sum contract, but inputs may contain 100,000 values. Either index order is valid. Use a `Map` to retain the information needed for constant-average-time complement lookup; the verifier rejects work proportional to every possible pair.

### Examples

- `pairSumAtScale([3, 2, 4], 6) -> [1, 2]`
- `pairSumAtScale([3, 3], 6) -> [0, 1]`

### Constraints

- 0 <= nums.length <= 100,000
- Values and target may be negative.
- Return null if impossible.
- The returned pair may list its two indices in either order.

## Contract checks

- Which result ordering is acceptable?
- How do duplicate values affect stored information?
- What operation would let one element rule in a partner immediately?

These are prompts, not required individual answers. In `lessons/03-pair-sum-at-scale/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/03-pair-sum-at-scale/learner_analysis.md`
- Implementation: `lessons/03-pair-sum-at-scale/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/03-pair-sum-at-scale/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

The verifier also confirms that `pairSumAtScale` constructs the required `Map`; small output examples alone cannot distinguish it from a copied quadratic scan.

## Common traps

- Inserting the current value before checking and accidentally reusing its index.
- Storing values without enough information to return indices.
- Claiming constant space while retaining information proportional to n.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you adapt the approach if the input were already sorted but original indices were unnecessary?

Do not code the variation unless you want extra practice.
