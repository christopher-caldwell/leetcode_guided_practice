# 16. Checkpoint III: Minimum Processing Rate

## Interview skill being developed

mixed retrieval, monotonic feasibility reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 12–15. The relevant pattern is intentionally not announced.

## Problem statement

A worker processes one job per hour and can complete up to rate units from that job. Return the smallest positive integer rate that completes all jobs within hours. A partially processed hour still consumes a full hour.

### Examples

- `minimumProcessingRate([3, 6, 7, 11], 8) -> 4`
- `minimumProcessingRate([30], 5) -> 6`

### Constraints

- 1 <= jobs.length <= 100,000
- 1 <= jobs[i] <= 1,000,000,000
- jobs.length <= hours <= 1,000,000,000

## Clarifying questions to consider

- Can time be shared between jobs in one hour?
- Must the rate be an integer?
- Is a feasible rate necessarily minimal?

Write your actual assumptions and answers in `lessons/16-checkpoint-processing-rate/analysis.md` before coding.

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

- Reasoning: `lessons/16-checkpoint-processing-rate/analysis.md`
- Implementation: `lessons/16-checkpoint-processing-rate/solutions/typescript/solution.ts`
- Visible examples: `lessons/16-checkpoint-processing-rate/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without revealing private cases wholesale.

## Common traps

- Linearly trying every possible rate up to the largest job.
- Using floor division for partially completed hours.
- Overflowing an accumulated hour count in other interview languages.

## Post-pass reflection

After passing, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Then consider this variation:

> How would the feasibility calculation change if unused hourly capacity could continue into the next job?

Do not code the variation unless you want extra practice.
