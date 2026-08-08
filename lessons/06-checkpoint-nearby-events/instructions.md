# 06. Checkpoint I: Nearby Repeated Events

## Interview skill being developed

mixed retrieval, constraint-driven data-structure selection. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 1–5. The relevant pattern is intentionally not announced.

## Problem statement

Given an event stream and maximum index distance, return true when the same event appears at two distinct indices no farther apart than maxDistance.

### Examples

- `hasNearbyRepeat(['login', 'view', 'login'], 2) -> true`
- `hasNearbyRepeat(['a', 'b', 'a'], 1) -> false`

### Constraints

- 0 <= events.length <= 100,000
- 0 <= maxDistance <= 100,000
- Do not mutate the input.

## Contract checks

- Is distance measured by index difference?
- Can maxDistance be zero?
- Do we need the pair or only its existence?

These are prompts, not required individual answers. In `lessons/06-checkpoint-nearby-events/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/06-checkpoint-nearby-events/learner_analysis.md`
- Implementation: `lessons/06-checkpoint-nearby-events/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/06-checkpoint-nearby-events/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Comparing every pair despite the input bound.
- Forgetting that a later occurrence may be closer than an earlier one.
- Treating equal strings at one index as two events.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return the closest repeated pair instead of a boolean?

Do not code the variation unless you want extra practice.
